const ResearchService = require('../services/ai/research.service');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.generateResearch = async (req, res, next) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Helper to send SSE data
    const sendSSE = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // 1. Check Cache
    sendSSE({ progress: 'Checking cache...' });
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cachedReport = await prisma.researchHistory.findFirst({
      where: {
        companyName: {
          equals: companyName,
          mode: 'insensitive'
        },
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      include: {
        analysisDetails: true
      }
    });

    if (cachedReport) {
      sendSSE({ progress: 'Found cached report.' });
      sendSSE({ success: true, data: cachedReport });
      return res.end();
    }

    // 2. Call AI Service to generate report
    const onProgress = (msg) => {
      sendSSE({ progress: msg });
    };

    const reportData = await ResearchService.generateReport(companyName, onProgress);

    sendSSE({ progress: 'Saving to database...' });

    // 3. Save to Database (Prisma)
    const savedReport = await prisma.researchHistory.create({
      data: {
        companyName: reportData.companyName,
        tickerSymbol: reportData.tickerSymbol,
        investmentScore: reportData.investmentScore,
        recommendation: reportData.recommendation,
        analysisDetails: {
          create: {
            industry: reportData.industry,
            ceo: reportData.ceo,
            headquarters: reportData.headquarters,
            marketCap: reportData.marketCap,
            totalRevenue: reportData.totalRevenue,
            netIncome: reportData.netIncome,
            peRatio: reportData.peRatio,
            revenueGrowth: reportData.revenueGrowth,
            overview: reportData.overview,
            businessModel: reportData.businessModel,
            financials: reportData.financials,
            marketPosition: reportData.marketPosition,
            competitors: reportData.competitors,
            latestNews: reportData.latestNews,
            growthOps: reportData.growthOps,
            risks: reportData.risks,
            reasoning: reportData.reasoning
          }
        }
      },
      include: {
        analysisDetails: true // Return the nested data as well
      }
    });

    // 4. Return final response
    sendSSE({ progress: 'Done' });
    sendSSE({ success: true, data: savedReport });
    return res.end();
  } catch (error) {
    console.error(error);
    // Only send if headers aren't sent, but for SSE we just send the error event
    if (!res.headersSent) {
      return next(error);
    }
    res.write(`data: ${JSON.stringify({ success: false, message: error.message })}\n\n`);
    return res.end();
  }
};

exports.getResearchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.researchHistory.findUnique({
      where: { id },
      include: {
        analysisDetails: true
      }
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Research report not found' });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllResearch = async (req, res, next) => {
  try {
    const reports = await prisma.researchHistory.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        tickerSymbol: true,
        investmentScore: true,
        recommendation: true,
        createdAt: true
        // Intentionally excluding analysisDetails to keep the payload light
      }
    });

    return res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};
