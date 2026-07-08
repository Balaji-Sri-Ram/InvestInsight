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

    // 1. Call AI Service to generate report
    const reportData = await ResearchService.generateReport(companyName);

    // 2. Save to Database (Prisma)
    const savedReport = await prisma.researchHistory.create({
      data: {
        companyName: reportData.companyName,
        tickerSymbol: reportData.tickerSymbol,
        investmentScore: reportData.investmentScore,
        recommendation: reportData.recommendation,
        analysisDetails: {
          create: {
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

    // 3. Return response
    return res.status(201).json({
      success: true,
      data: savedReport
    });
  } catch (error) {
    next(error);
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
