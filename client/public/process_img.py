from PIL import Image

def process_image():
    img = Image.open('i.avif').convert('RGBA')
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Calculate grayscale
        avg = int((item[0] + item[1] + item[2]) / 3)
        # White background -> transparent, Black letter -> opaque
        # Threshold: if it's lighter than 200, make it transparent
        # But for smooth edges, we map the alpha channel inversely to the brightness.
        # Alpha = 255 - avg
        alpha = 255 - avg
        newData.append((0, 0, 0, alpha))
        
    img.putdata(newData)
    img.save('i-mask.png', 'PNG')

process_image()
