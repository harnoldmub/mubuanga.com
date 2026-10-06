#!/usr/bin/env python3
"""Asset pipeline: selects, cleans, renames and optimises the source assets
into the served `public/assets` tree. Run from the project root."""
import os, shutil, subprocess, sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = "public/assets"
TMP = ".asset-tmp"

def sh(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def ensure(*paths):
    for p in paths:
        os.makedirs(p, exist_ok=True)

def webp(img, dest, quality=80, lossless=False):
    ensure(os.path.dirname(dest))
    tmp = os.path.join(TMP, "tmp.png")
    img.save(tmp)
    args = ["cwebp", "-quiet", "-mt"]
    if lossless:
        args += ["-lossless", "-z", "9"]
    else:
        args += ["-q", str(quality)]
    if img.mode == "RGBA":
        args += ["-alpha_q", "100"]
    sh(*args, tmp, "-o", dest)
    return os.path.getsize(dest)

# --------------------------------------------------------------------------
# 1. Brand — AMY monogram (from the supplied artwork) + Dizayna mark
# --------------------------------------------------------------------------
def build_brand():
    src = os.environ.get("AMY_LOGO_SRC", "_source-assets/amy-monogram-source.png")
    im = Image.open(src).convert("RGBA")
    # The export carries a faint drop-shadow halo (alpha 16-31) that reads as
    # speckle on a dark background. Cut everything under the shape threshold.
    a = im.getchannel("A").point(lambda v: 255 if v > 96 else 0)
    a = a.filter(ImageFilter.GaussianBlur(0.4))
    px = im.copy(); px.putalpha(a)
    px = px.crop(px.getbbox())
    # Force a pure off-white ink so the mark sits in the palette.
    w, h = px.size
    flat = Image.new("RGBA", (w, h), (242, 240, 234, 255))
    flat.putalpha(px.getchannel("A"))
    mark = Image.alpha_composite(flat, px.point(lambda v: v))  # keep paper shading
    mark = Image.merge("RGBA", (*px.convert("RGB").split(), px.getchannel("A")))
    target_w = 1200
    mark = mark.resize((target_w, round(h * target_w / w)), Image.LANCZOS)
    ensure(f"{OUT}/brand")
    mark.save(f"{OUT}/brand/amy-monogram.png", optimize=True)
    print("brand/amy-monogram.png", mark.size, os.path.getsize(f"{OUT}/brand/amy-monogram.png") // 1024, "KB")

    # Favicon + apple icon: monogram centred on the ink square.
    for size, name in ((512, "src/app/icon.png"), (180, "src/app/apple-icon.png")):
        pad = round(size * 0.06)
        box = size - pad * 2
        m = mark.copy()
        m.thumbnail((box, box), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (5, 5, 5, 255))
        canvas.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
        canvas.convert("RGB").save(name, optimize=True)
        print(name, canvas.size)


# --------------------------------------------------------------------------
# 2. Portrait — strip the burnt-in blue orbit, desaturate, crop editorially
# --------------------------------------------------------------------------
def build_portrait():
    im = Image.open("_source-assets/arnold-website.png").convert("RGBA")
    out = []
    for (r, g, b, al) in im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata():
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if al and sat > 0.16 and b > r + 10:
            out.append((0, 0, 0, 0))          # burnt-in blue orbit + code badge
        else:
            l = int(0.299 * r + 0.587 * g + 0.114 * b)
            out.append((l, l, l, al))         # editorial black & white
    clean = Image.new("RGBA", im.size); clean.putdata(out)
    clean = clean.crop(clean.getbbox()).crop((140, 20, 752, 824))
    # Flatten onto the ink: the cutout is only ever shown against it, and an
    # opaque file survives any format negotiation.
    plate = Image.new("RGB", clean.size, (5, 5, 5))
    plate.paste(clean, (0, 0), clean)
    ensure(f"{OUT}/portraits")
    size = webp(plate, f"{OUT}/portraits/arnold-portrait.webp", quality=86)
    print("portraits/arnold-portrait.webp", plate.size, size // 1024, "KB")

# --------------------------------------------------------------------------
# 3. Projects — normalise every capture to 16:10, dropping cookie banners
# --------------------------------------------------------------------------
# slug -> (source stem, usable height fraction, horizontal anchor)
CAPTURES = {
    "e-visa":                ("e-visa_mubuanga_com", 1.0, "c"),
    "dgm":                   ("dgm_mubuanga_com", 1.0, "c"),
    "daylora":               ("daylora_co", 1.0, "c"),
    "mboka-hub":             ("mbokahub_com", 0.68, "l"),
    "bloc-leopards":         ("blocleopards_mubuanga_com", 1.0, "c"),
    "salon-congo-paris":     ("salon_congonaparis_fr", 1.0, "c"),
    "tselem-studio":         ("tselem_studio", 1.0, "c"),
    "awa-network":           ("awanetwork_com", 1.0, "c"),
    "u-moja":                ("u-moja_org", 1.0, "c"),
    "momento-wedding":       ("momento_wedding", 1.0, "c"),
    "malkya":                ("malkya_co", 1.0, "c"),
    "cozy-interieur":        ("cozyinterieur_com", 1.0, "c"),
    "tselem-rdc":            ("tselemrdc_com", 1.0, "c"),
    "fondation-noah-sadiki": ("fondationnoahsadiki_org", 1.0, "c"),
    "kecha-2026":            ("kecha_2026", 1.0, "c"),
    "mami-samarylin-2026":   ("mami_samarylin_2026", 1.0, "c"),
    "agdtn":                 ("agdtn_com", 1.0, "c"),
    "lombayo-consulting":    ("lombayo_consulting_com", 1.0, "c"),
    "amcros-institut":       ("amcros_institut_com", 1.0, "c"),
    "amcros-events":         ("amcros_events", 1.0, "c"),
    "avc":                   ("parti_avc_cd", 1.0, "c"),
    "luxos":                 ("luxos", 1.0, "c"),
    "natacha-ruddy":         ("tasha_ruddy", 1.0, "c"),
}
DESKTOP_RATIO = 1.6  # 16:10

# Display names for the social cards, keyed by slug (mirrors src/data/projects.ts).
NAMES = {
    "e-visa": "E-Visa RDC", "dgm": "DGM", "daylora": "Daylora",
    "mboka-hub": "Mboka Hub", "bloc-leopards": "Bloc Léopards",
    "salon-congo-paris": "Congo à Paris", "tselem-studio": "TSELEM Studio",
    "awa-network": "AWA Network", "u-moja": "U-Moja",
    "momento-wedding": "Momento Wedding", "malkya": "Malkya",
    "cozy-interieur": "Cozy Intérieur", "tselem-rdc": "TSELEM RDC",
    "fondation-noah-sadiki": "Fondation Noah Sadiki",
    "kecha-2026": "Ketsia & Chad", "mami-samarylin-2026": "Mamisa & Marylin",
    "agdtn": "AGDTN",
    "lombayo-consulting": "Lombayo Consulting", "amcros-institut": "Amcros Institut",
    "amcros-events": "Amcros Events", "avc": "AVC", "luxos": "Luxos RDC",
    "natacha-ruddy": "Natacha & Ruddy",
}

def build_projects():
    ensure(f"{OUT}/projects")
    total = 0
    for slug, (stem, frac, anchor) in CAPTURES.items():
        src = f"_source-assets/screenshots/{stem}.png"
        im = Image.open(src).convert("RGB")
        w, h = im.size
        usable = round(h * frac)
        # keep the tallest 16:10 window that fits inside the banner-free area
        cw = min(w, round(usable * DESKTOP_RATIO))
        ch = round(cw / DESKTOP_RATIO)
        left = 0 if anchor == "l" else (w - cw) // 2
        im = im.crop((left, 0, left + cw, ch))
        if im.width > 1440:
            im = im.resize((1440, round(1440 / DESKTOP_RATIO)), Image.LANCZOS)
        total += webp(im, f"{OUT}/projects/{slug}-desktop.webp", quality=78)

        mob = Image.open(f"_source-assets/screenshots/{stem}_mobile.png").convert("RGB")
        mob = mob.crop((0, 0, mob.width, min(mob.height, round(mob.width * 2.05))))
        total += webp(mob, f"{OUT}/projects/{slug}-mobile.webp", quality=80)
        print(f"projects/{slug}", im.size, mob.size)
    print("projects total", total // 1024, "KB")
    build_gallery()


def build_gallery():
    """Section captures further down each page, for the case-study gallery.

    Writes `src/data/gallery.generated.ts` so the pages know how many frames
    exist per project without touching the filesystem at render time.
    """
    ensure(f"{OUT}/projects")
    for old in os.listdir(f"{OUT}/projects"):
        if "-s" in old and old[:-5].rsplit("-s", 1)[-1].isdigit():
            os.remove(f"{OUT}/projects/{old}")
    counts, total = {}, 0
    for slug, (stem, _, _) in CAPTURES.items():
        desk = mob = 0
        for i in range(1, 9):
            src = f"_source-assets/screenshots/{stem}_s{i}.png"
            if not os.path.exists(src):
                break
            im = Image.open(src).convert("RGB")
            ch = round(im.width / DESKTOP_RATIO)
            im = im.crop((0, 0, im.width, min(im.height, ch)))
            if im.width > 1440:
                im = im.resize((1440, round(1440 * im.height / im.width)), Image.LANCZOS)
            total += webp(im, f"{OUT}/projects/{slug}-s{i}.webp", quality=74)
            desk = i
        for i in range(1, 9):
            src = f"_source-assets/screenshots/{stem}_mobile_s{i}.png"
            if not os.path.exists(src):
                break
            im = Image.open(src).convert("RGB")
            im = im.crop((0, 0, im.width, min(im.height, round(im.width * 2.05))))
            total += webp(im, f"{OUT}/projects/{slug}-mobile-s{i}.webp", quality=78)
            mob = i
        counts[slug] = (desk, mob)
    lines = [
        "// Generated by scripts/build-assets.py — do not edit by hand.",
        "// Number of section captures per project: [desktop, mobile].",
        "export const galleryCounts: Record<string, readonly [number, number]> = {",
    ]
    lines += [f'  "{k}": [{d}, {m}],' for k, (d, m) in counts.items()]
    lines += ["};", ""]
    open("src/data/gallery.generated.ts", "w").write("\n".join(lines))
    print("gallery", sum(d + m for d, m in counts.values()), "frames", total // 1024, "KB")

# --------------------------------------------------------------------------
# 4. Hero object — chrome ring: light GLB for WebGL + desaturated still
# --------------------------------------------------------------------------
def strip_unused_attributes(src, dest, drop=("TEXCOORD_0", "TANGENT", "COLOR_0")):
    """Rewrite a GLB without vertex attributes nothing reads.

    The ring is shaded by a material with no texture, so its UVs are dead
    weight on every visitor's connection — and on a phone that is the single
    biggest cost of showing it at all.
    """
    import struct, json as _json

    with open(src, "rb") as f:
        _, _, _ = struct.unpack("<III", f.read(12))
        jlen, _ = struct.unpack("<II", f.read(8))
        gltf = _json.loads(f.read(jlen))
        blen, _ = struct.unpack("<II", f.read(8))
        blob = f.read(blen)

    for mesh in gltf.get("meshes", []):
        for prim in mesh.get("primitives", []):
            for name in drop:
                prim["attributes"].pop(name, None)

    # Which accessors survive, and therefore which bufferViews.
    keep = set()
    for mesh in gltf.get("meshes", []):
        for prim in mesh.get("primitives", []):
            keep.update(prim["attributes"].values())
            if "indices" in prim:
                keep.add(prim["indices"])
    for anim in gltf.get("animations", []):
        for smp in anim.get("samplers", []):
            keep.update((smp["input"], smp["output"]))
    for skin in gltf.get("skins", []):
        if "inverseBindMatrices" in skin:
            keep.add(skin["inverseBindMatrices"])

    old_acc = gltf["accessors"]
    acc_map, accessors, views, chunks, offset = {}, [], [], [], 0
    view_map = {}

    for i, acc in enumerate(sorted(keep)):
        acc_map[acc] = i
    for acc in sorted(keep):
        a = dict(old_acc[acc])
        vi = a.get("bufferView")
        if vi is not None and vi not in view_map:
            v = gltf["bufferViews"][vi]
            start = v.get("byteOffset", 0)
            data = blob[start : start + v["byteLength"]]
            pad = (-len(data)) % 4
            nv = {k: v[k] for k in ("byteStride", "target") if k in v}
            nv["buffer"] = 0
            nv["byteOffset"] = offset
            nv["byteLength"] = len(data)
            view_map[vi] = len(views)
            views.append(nv)
            chunks.append(data + b"\x00" * pad)
            offset += len(data) + pad
        if vi is not None:
            a["bufferView"] = view_map[vi]
        accessors.append(a)

    for mesh in gltf.get("meshes", []):
        for prim in mesh.get("primitives", []):
            prim["attributes"] = {k: acc_map[v] for k, v in prim["attributes"].items()}
            if "indices" in prim:
                prim["indices"] = acc_map[prim["indices"]]

    gltf["accessors"] = accessors
    gltf["bufferViews"] = views
    gltf["buffers"] = [{"byteLength": offset}]
    gltf.pop("images", None)
    gltf.pop("samplers", None)
    gltf.pop("textures", None)

    jb = _json.dumps(gltf, separators=(",", ":")).encode()
    jb += b" " * ((-len(jb)) % 4)
    bb = b"".join(chunks)
    total = 12 + 8 + len(jb) + 8 + len(bb)
    with open(dest, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(jb), 0x4E4F534A))
        f.write(jb)
        f.write(struct.pack("<II", len(bb), 0x004E4942))
        f.write(bb)


def build_hero():
    ensure(f"{OUT}/3d")
    src = "_source-assets/chrome-ring.glb"
    dest = f"{OUT}/3d/chrome-ring.glb"
    strip_unused_attributes(src, dest)
    print(
        "3d/chrome-ring.glb",
        os.path.getsize(src) // 1024,
        "KB ->",
        os.path.getsize(dest) // 1024,
        "KB",
    )

    im = Image.open("_source-assets/chrome-ring-render.png").convert("RGBA")
    im = im.crop(im.getbbox())
    px = []
    for (r, g, b, a) in (im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()):
        l = int(0.299 * r + 0.587 * g + 0.114 * b)
        l = min(255, int(l * 1.06))           # lift to a cool silver
        px.append((l, l, min(255, l + 4), a))
    silver = Image.new("RGBA", im.size); silver.putdata(px)
    silver.thumbnail((1100, 1100), Image.LANCZOS)
    size = webp(silver, f"{OUT}/3d/chrome-ring.webp", quality=82)
    print("3d/chrome-ring.webp", silver.size, size // 1024, "KB")

# --------------------------------------------------------------------------
# 5. Social card — typographic, deliberately without the monogram
# --------------------------------------------------------------------------
def build_og():
    from PIL import ImageDraw, ImageFont
    W, H = 1200, 630
    ink, paper, grey, blue = (5, 5, 5), (242, 240, 234), (139, 139, 139), (36, 93, 255)
    card = Image.new("RGB", (W, H), ink)
    d = ImageDraw.Draw(card)
    hv = "/System/Library/Fonts/HelveticaNeue.ttc"
    big = ImageFont.truetype(hv, 104, index=1)     # Bold
    mid = ImageFont.truetype(hv, 28, index=10)     # Medium
    small = ImageFont.truetype(hv, 20, index=10)
    for i in range(1, 4):                          # editorial column rules
        x = 72 + i * ((W - 144) / 4)
        d.line([(x, 0), (x, H)], fill=(21, 21, 21), width=1)
    def tracked(xy, text, font, fill, tracking=0):
        x, y = xy
        for ch in text:
            d.text((x, y), ch, font=font, fill=fill)
            x += d.textlength(ch, font=font) + tracking
        return x
    tracked((72, 86), "SOFTWARE ENGINEER", small, blue, 2.4)
    tracked((352, 86), "PRODUCT BUILDER", small, grey, 2.4)
    tracked((610, 86), "IT PROJECT LEAD", small, grey, 2.4)
    d.line([(72, 132), (W - 72, 132)], fill=(38, 38, 38), width=1)
    for i, line in enumerate(("I BUILD", "DIGITAL", "PRODUCTS.")):
        tracked((68, 172 + i * 108), line, big, paper, -3.5)
    d.line([(72, H - 118), (W - 72, H - 118)], fill=(38, 38, 38), width=1)
    label = "ARNOLD MUBUANGA YATE"
    w = sum(d.textlength(c, font=mid) + 2 for c in label)
    tracked((W - 72 - w, H - 92), label, mid, paper, 2)
    site = "MUBUANGA.COM"
    w2 = sum(d.textlength(c, font=small) + 2.4 for c in site)
    tracked((W - 72 - w2, H - 56), site, small, grey, 2.4)
    card.save("public/og.png", optimize=True)
    print("public/og.png", os.path.getsize("public/og.png") // 1024, "KB")

# --------------------------------------------------------------------------
# 5b. Per-project social cards — the capture, dimmed, with the project name
# --------------------------------------------------------------------------
def build_project_og():
    from PIL import ImageDraw, ImageFont
    ensure(f"{OUT}/og")
    hv = "/System/Library/Fonts/HelveticaNeue.ttc"
    name_font = ImageFont.truetype(hv, 72, index=1)
    meta_font = ImageFont.truetype(hv, 22, index=10)
    W, H = 1200, 630
    total = 0

    for slug in CAPTURES:
        shot = Image.open(f"{OUT}/projects/{slug}-desktop.webp").convert("RGB")
        # Cover-crop the capture into the card, anchored at the top.
        scale = max(W / shot.width, H / shot.height)
        shot = shot.resize((round(shot.width * scale), round(shot.height * scale)), Image.LANCZOS)
        shot = shot.crop((0, 0, W, H))

        # Ink veil, heaviest at the bottom where the type sits.
        veil = Image.new("L", (1, H))
        for y in range(H):
            t = y / H
            veil.putpixel((0, y), int(150 + 105 * t**1.6))
        veil = veil.resize((W, H))
        card = Image.composite(Image.new("RGB", (W, H), (5, 5, 5)), shot, veil)

        d = ImageDraw.Draw(card)
        d.line([(72, H - 190), (W - 72, H - 190)], fill=(90, 90, 90), width=1)

        def tracked(xy, text, font, fill, tracking=0):
            x, y = xy
            for ch in text:
                d.text((x, y), ch, font=font, fill=fill)
                x += d.textlength(ch, font=font) + tracking

        tracked((72, H - 168), "ARNOLD MUBUANGA YATE — SELECTED WORK", meta_font, (139, 139, 139), 2.2)
        tracked((68, H - 122), NAMES[slug].upper(), name_font, (242, 240, 234), -2)
        total += os.path.getsize(f"{OUT}/og/{slug}.jpg") if False else 0
        card.save(f"{OUT}/og/{slug}.jpg", quality=78, optimize=True, progressive=True)
        total += os.path.getsize(f"{OUT}/og/{slug}.jpg")
    print("og cards", len(CAPTURES), total // 1024, "KB")


# --------------------------------------------------------------------------
# 6. Tech marks — strip metadata, force currentColor
# --------------------------------------------------------------------------
def build_icons():
    ensure(f"{OUT}/icons")
    import re
    for name in sorted(os.listdir("_source-assets/icons")):
        if not name.endswith(".svg"):
            continue
        svg = open(f"_source-assets/icons/{name}", encoding="utf-8").read()
        svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
        svg = re.sub(r"<title>.*?</title>", "", svg, flags=re.S)
        svg = re.sub(r'\sfill="(?!none)[^"]*"', ' fill="currentColor"', svg)
        svg = re.sub(r"\s+", " ", svg).strip()
        open(f"{OUT}/icons/{name}", "w", encoding="utf-8").write(svg)
    print("icons", len(os.listdir(f"{OUT}/icons")))

if __name__ == "__main__":
    ensure(TMP)
    steps = sys.argv[1:] or ["brand", "portrait", "projects", "hero", "og", "project_og", "icons"]
    for s in steps:
        globals()[f"build_{s}"]()
    shutil.rmtree(TMP, ignore_errors=True)
