import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generateResumePdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Set metadata
  pdfDoc.setTitle('Vedant Sattegiri Patil - Resume');
  pdfDoc.setAuthor('Vedant Sattegiri Patil');
  pdfDoc.setSubject('Curriculum Vitae / Resume');
  pdfDoc.setKeywords(['Security Researcher', 'AI Tooling', 'Software Engineer', 'Vedant Sattegiri Patil', 'Resume']);
  pdfDoc.setCreator('Vedant Sattegiri Patil Portfolio');
  pdfDoc.setProducer('pdf-lib');

  // Standard Letter dimensions: 612 x 792 pt
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette
  const colorPrimary = rgb(15 / 255, 23 / 255, 42 / 255);       // Slate 900
  const colorAccent = rgb(5 / 255, 150 / 255, 105 / 255);        // Emerald 600
  const colorBody = rgb(51 / 255, 65 / 255, 85 / 255);          // Slate 700
  const colorSubtext = rgb(100 / 255, 116 / 255, 139 / 255);    // Slate 500
  const colorDivider = rgb(226 / 255, 232 / 255, 240 / 255);    // Slate 200
  const colorBullet = rgb(16 / 255, 185 / 255, 129 / 255);      // Emerald 500

  const marginX = 46;
  const contentWidth = width - marginX * 2; // 520 pt
  let cursorY = height - 46;

  // Helper to wrap text into lines
  function wrapText(text: string, font: typeof fontRegular, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(candidate, fontSize);
      if (lineWidth <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // --- HEADER ---
  page.drawText('Vedant Sattegiri Patil', {
    x: marginX,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: colorPrimary,
  });
  cursorY -= 17;

  page.drawText('Student-Builder & Security Researcher', {
    x: marginX,
    y: cursorY,
    size: 10.5,
    font: fontBold,
    color: colorAccent,
  });
  cursorY -= 14;

  const contactLine = 'Location: Pune, Maharashtra, India   •   Email: veddoesai@proton.me   •   GitHub: https://github.com/vedwebsites-eng';
  page.drawText(contactLine, {
    x: marginX,
    y: cursorY,
    size: 8.5,
    font: fontRegular,
    color: colorSubtext,
  });
  cursorY -= 12;

  // Divider line
  page.drawLine({
    start: { x: marginX, y: cursorY },
    end: { x: width - marginX, y: cursorY },
    thickness: 1,
    color: colorDivider,
  });
  cursorY -= 15;

  // Helper: Section Header
  function drawSectionHeader(title: string) {
    page.drawText(title, {
      x: marginX,
      y: cursorY,
      size: 10,
      font: fontBold,
      color: colorPrimary,
    });
    
    // Emerald underline for section title
    const titleWidth = fontBold.widthOfTextAtSize(title, 10);
    page.drawLine({
      start: { x: marginX, y: cursorY - 3 },
      end: { x: marginX + titleWidth + 12, y: cursorY - 3 },
      thickness: 1.5,
      color: colorAccent,
    });

    // Subtle line extending to right margin
    page.drawLine({
      start: { x: marginX + titleWidth + 16, y: cursorY - 3 },
      end: { x: width - marginX, y: cursorY - 3 },
      thickness: 0.5,
      color: colorDivider,
    });

    cursorY -= 14;
  }

  // Helper: Bullet Item with bold title and normal text
  function drawBulletItem(bulletTitle: string, bulletText: string, indent = 14) {
    const bulletChar = '•';
    page.drawText(bulletChar, {
      x: marginX + 2,
      y: cursorY,
      size: 9.5,
      font: fontBold,
      color: colorBullet,
    });

    const fullText = bulletTitle ? `${bulletTitle}: ${bulletText}` : bulletText;
    const textX = marginX + indent;
    const maxItemWidth = contentWidth - indent;
    const lines = wrapText(fullText, fontRegular, 9, maxItemWidth);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && bulletTitle) {
        // Render bold title portion if it fits on first line
        const titleWithColon = `${bulletTitle}:`;
        const titleWidth = fontBold.widthOfTextAtSize(titleWithColon, 9);
        
        if (line.startsWith(titleWithColon)) {
          page.drawText(titleWithColon, {
            x: textX,
            y: cursorY,
            size: 9,
            font: fontBold,
            color: colorPrimary,
          });
          const restOfLine = line.substring(titleWithColon.length);
          page.drawText(restOfLine, {
            x: textX + titleWidth,
            y: cursorY,
            size: 9,
            font: fontRegular,
            color: colorBody,
          });
        } else {
          page.drawText(line, {
            x: textX,
            y: cursorY,
            size: 9,
            font: fontRegular,
            color: colorBody,
          });
        }
      } else {
        page.drawText(line, {
          x: textX,
          y: cursorY,
          size: 9,
          font: fontRegular,
          color: colorBody,
        });
      }
      cursorY -= 12;
    }
    cursorY -= 3;
  }

  // --- 1. SUMMARY ---
  drawSectionHeader('SUMMARY');
  const summaryText =
    '15-year-old self-taught builder and security researcher based in Pune. Blending an offensive cybersecurity mindset with modern AI system development and software engineering. Passionate about uncovering edge-case vulnerabilities, creating developer tooling, and educating builders through high-signal technical content.';
  
  const summaryLines = wrapText(summaryText, fontRegular, 9, contentWidth);
  for (const line of summaryLines) {
    page.drawText(line, {
      x: marginX,
      y: cursorY,
      size: 9,
      font: fontRegular,
      color: colorBody,
    });
    cursorY -= 12.5;
  }
  cursorY -= 9;

  // --- 2. RESEARCH & INITIATIVES ---
  drawSectionHeader('RESEARCH & INITIATIVES');
  drawBulletItem(
    'Bug Bounty Research & Vulnerability Hunting',
    'Active research on web applications, finding logic bugs, access control failures (IDORs), and misconfigurations. Focus on automated recon tooling.'
  );
  drawBulletItem(
    'Autonomous AI Tooling & Local Intelligence',
    'Building agentic workflows that turn unstructured instructions into deterministic multi-step tool execution. Integrating Gemini & local LLMs.'
  );
  drawBulletItem(
    'Technical Media & Content (RootCause)',
    'Creator and producer of RootCause, producing short-form video content covering technology and cybersecurity concepts.'
  );
  cursorY -= 7;

  // --- 3. FEATURED PROJECTS ---
  drawSectionHeader('FEATURED PROJECTS');
  drawBulletItem(
    'AETHOS',
    'Gamified self-improvement engine with AI coach Ace, dynamic XP curve, cyberpunk UI.'
  );
  drawBulletItem(
    'RootCause',
    'Faceless YouTube channel covering tech and cybersecurity in short-form video.'
  );
  drawBulletItem(
    'Inkwell',
    'Distraction-free typographic note engine engineered with editorial aesthetics.'
  );
  cursorY -= 7;

  // --- 4. EDUCATION ---
  drawSectionHeader('EDUCATION');
  drawBulletItem(
    'Pune High School',
    'Secondary Education / Class 10, Pune, India'
  );
  cursorY -= 7;

  // --- 5. HONORS & HIGHLIGHTS ---
  drawSectionHeader('HONORS & HIGHLIGHTS');
  drawBulletItem(
    '',
    '3x Bug Bounty Programs, HackerOne — valid vulnerability disclosed'
  );
  drawBulletItem(
    '',
    '3x AI Workshops completed under Vaibhav Sisinty (Outskill)'
  );
  drawBulletItem(
    '',
    'Anthropic Certified — Claude, Claude Code, Claude Cowork'
  );
  drawBulletItem(
    '',
    'CCNA (Networking) — in progress'
  );

  // Footer note at bottom
  page.drawLine({
    start: { x: marginX, y: 34 },
    end: { x: width - marginX, y: 34 },
    thickness: 0.5,
    color: colorDivider,
  });
  page.drawText('Vedant Sattegiri Patil  •  Curriculum Vitae  •  github.com/vedwebsites-eng', {
    x: marginX,
    y: 22,
    size: 7.5,
    font: fontRegular,
    color: colorSubtext,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve(process.cwd(), 'public/resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Successfully generated resume.pdf at ${outputPath} (${pdfBytes.length} bytes)`);
}

generateResumePdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
