// @flow

import patchAnchorElements from './patchAnchorElements';
import patchBreakElements from './patchBreakElements';
import patchElementInlineStyles from './patchElementInlineStyles';
import patchListElements from './patchListElements';
import patchParagraphElements from './patchParagraphElements';
import patchStyleElements from './patchStyleElements';
import patchTableElements from './patchTableElements';
import toSafeHTMLDocument from './toSafeHTMLDocument';

const HTML_BODY_PATTERN = /<body[\s>]/i;
const LONG_UNDERLINE_PATTERN = /_+/g;

function replaceNOBR(matched: string): string {
  // This is a workround to convert "_______" into none-wrapped text
  // that apppears like a horizontal line.
  if (matched && matched.length >= 20) {
    // needs extra space after it so user can escape the <nobr />.
    matched = `<nobr>${String(matched)}</nobr> `;
  }
  return matched;
}

export default function normalizeHTML(html: string): string {
  let body: ?HTMLElement = null;

  const sourceIsPage = HTML_BODY_PATTERN.test(html);
  html = html.replace(LONG_UNDERLINE_PATTERN, replaceNOBR);
  const doc = toSafeHTMLDocument(html);
  if (doc) {
    // styles.
    patchStyleElements(doc);
    patchElementInlineStyles(doc);
    // contents.
    patchAnchorElements(doc);
    patchBreakElements(doc);
    patchListElements(doc);
    patchParagraphElements(doc);
    patchTableElements(doc);
    body = doc.getElementsByTagName('body')[0];

    if (body && sourceIsPage) {
      // Source HTML contains <body />, assumes this to be a complete
      // page HTML. Assume this <body /> may contain the style that indicates
      // page's layout.
      const frag = doc.createElement('html');
      frag.appendChild(body);
      return frag.innerHTML;
    }
  }

  if (!body) {
    // <body /> should alway be generated by doc.
    return 'Unsupported HTML content';
  }

  // HTML snippet only.
  return '<body>' + body.innerHTML + '</body>';
}
