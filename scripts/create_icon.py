import sys
import os

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("This script requires the Pillow library.")
    print("Please run: pip install pillow")
    sys.exit(1)

def create_favicon(output_path="nex_favicon.png", size=1024):
    """
    Generates a high-quality PNG favicon for 'nex'.
    Design based on frontend/public/favicon.svg:
    - 64x64 canvas
    - Rounded Rect (r=12)
    - Gradient: #cb3837 to #a82726 (top-left to bottom-right)
    - Text: 'nex', Arial Bold, size 28, white, centered, baseline at y=44
    """
    print(f"Generating {output_path} with size {size}x{size}...")
    
    # Constants based on SVG
    SVG_SIZE = 64
    SVG_RADIUS = 12
    SVG_FONT_SIZE = 24
    
    # --- POSITION SETTINGS ---
    SVG_TEXT_X = 32   #--- NEW: 32 is horizontal center. Decrease to move Left, Increase to move Right.
    SVG_TEXT_Y = 50   # Existing Y position (baseline)
    # -------------------------

    COLOR_START = (203, 56, 55)   # #cb3837
    COLOR_END = (168, 39, 38)     # #a82726
    
    # 1. Generate Diagonal Gradient
    # Create a smaller gradient image and resize for smoothness
    grad_gen_size = 256
    grad_img = Image.new("RGB", (grad_gen_size, grad_gen_size))
    pixels = grad_img.load()
    
    for y in range(grad_gen_size):
        for x in range(grad_gen_size):
            # Normalized position along diagonal (0 to 1)
            p = (x + y) / (2 * grad_gen_size - 2)
            
            r = int(COLOR_START[0] + (COLOR_END[0] - COLOR_START[0]) * p)
            g = int(COLOR_START[1] + (COLOR_END[1] - COLOR_START[1]) * p)
            b = int(COLOR_START[2] + (COLOR_END[2] - COLOR_START[2]) * p)
            pixels[x, y] = (r, g, b)
            
    # Resize to target size
    resample_method = getattr(Image, 'Resampling', Image).BICUBIC
    base = grad_img.resize((size, size), resample=resample_method)
    
    # 2. Create Rounded Mask (Anti-aliased)
    # Draw at 4x resolution and downsample
    supersample = 4
    mask_size = size * supersample
    mask_large = Image.new("L", (mask_size, mask_size), 0)
    draw_large = ImageDraw.Draw(mask_large)
    
    radius = int(size * (SVG_RADIUS / SVG_SIZE))
    radius_large = radius * supersample
    
    # Draw white rounded rectangle on black background
    if hasattr(draw_large, "rounded_rectangle"):
        draw_large.rounded_rectangle(
            [(0, 0), (mask_size, mask_size)], 
            radius=radius_large, 
            fill=255
        )
    else:
        print("Warning: Pillow version too old for rounded_rectangle. Output will be square.")
        draw_large.rectangle([(0, 0), (mask_size, mask_size)], fill=255)

    lanczos_method = getattr(Image, 'Resampling', Image).LANCZOS
    mask = mask_large.resize((size, size), resample=lanczos_method)
    
    # Apply mask
    base.putalpha(mask)
    
    # 3. Draw Text
    draw = ImageDraw.Draw(base)
    font_size = int(size * (SVG_FONT_SIZE / SVG_SIZE))
    
    # Font Loading Strategy
    font_candidates = ["arialbd.ttf", "Arial Bold", "Arialbd", "LiberationSans-Bold.ttf", "DejaVuSans-Bold.ttf"]
    font = None
    for name in font_candidates:
        try:
            font = ImageFont.truetype(name, font_size)
            break
        except IOError:
            continue
            
    if font is None:
        print("Warning: Arial Bold not found. Using default font.")
        try:
            font = ImageFont.load_default()
        except:
            pass 

    text = "nex"
    
    # Position logic updated to use SVG_TEXT_X
    x = size * (SVG_TEXT_X / SVG_SIZE)
    y_baseline = size * (SVG_TEXT_Y / SVG_SIZE)
    
    # Draw text
    # 'anchor="ms"': Middle Horizontal, Baseline Vertical
    if font:
        try:
            draw.text((x, y_baseline), text, font=font, fill="white", anchor="ms")
        except ValueError:
            # Fallback for older Pillow
            w, h = draw.textsize(text, font=font)
            # transform baseline to top-left estimation
            draw.text((x - w/2, y_baseline - h), text, font=font, fill="white")

    # 4. Save
    try:
        base.save(output_path, "PNG")
        print(f"Successfully generated: {os.path.abspath(output_path)}")
    except Exception as e:
        print(f"Error saving image: {e}")

if __name__ == "__main__":
    create_favicon()