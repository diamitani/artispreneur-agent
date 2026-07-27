"use client";

import { Fragment, type ReactNode } from "react";

/**
 * Minimal, safe Markdown renderer.
 *
 * Deliberately does NOT use dangerouslySetInnerHTML: this renders model
 * output, so everything goes through React elements and is escaped by
 * construction. Supports the subset the executor actually emits — headings,
 * lists, blockquotes, fenced code, tables, bold/italic/code spans.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Order matters: code first so ** inside backticks stays literal.
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyBase}-i${i++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-[color:var(--color-card)] px-1 py-0.5 font-mono text-[0.85em] text-[color:var(--color-gold)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-[color:var(--color-text-primary)]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let inCode = false;
  let key = 0;

  const flushList = () => {
    if (!listBuffer.length) return;
    const items = [...listBuffer];
    listBuffer = [];
    blocks.push(
      <ul key={`ul-${key++}`} className="my-2 space-y-1 pl-4">
        {items.map((item, i) => (
          <li key={i} className="list-disc text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
            {renderInline(item, `li-${key}-${i}`)}
          </li>
        ))}
      </ul>,
    );
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");

    if (line.trim().startsWith("```")) {
      if (inCode) {
        const code = codeBuffer.join("\n");
        codeBuffer = [];
        inCode = false;
        blocks.push(
          <pre
            key={`pre-${key++}`}
            className="my-3 overflow-x-auto rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-black)] p-3 font-mono text-[11.5px] leading-relaxed text-[color:var(--color-text-muted)]"
          >
            {code}
          </pre>,
        );
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(raw);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      const level = (heading[1] ?? "#").length;
      const size =
        level === 1 ? "text-lg" : level === 2 ? "text-[15px]" : "text-[13.5px]";
      blocks.push(
        <p
          key={`h-${key++}`}
          className={`font-heading mt-4 mb-1.5 ${size} text-[color:var(--color-text-primary)]`}
        >
          {renderInline(heading[2] ?? "", `h-${key}`)}
        </p>,
      );
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*+]\s+/, ""));
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*\d+\.\s+/, ""));
      continue;
    }

    if (line.startsWith(">")) {
      flushList();
      blocks.push(
        <p
          key={`q-${key++}`}
          className="my-2 border-l-2 border-[color:var(--color-gold)] bg-[color:var(--color-card)] py-1.5 pl-3 text-[12.5px] italic text-[color:var(--color-text-muted)]"
        >
          {renderInline(line.replace(/^>\s?/, ""), `q-${key}`)}
        </p>,
      );
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      // Table rows render as monospace lines; separator rows are dropped.
      if (!/^\s*\|[\s:|-]+\|\s*$/.test(line)) {
        flushList();
        blocks.push(
          <p
            key={`t-${key++}`}
            className="overflow-x-auto whitespace-pre font-mono text-[11.5px] text-[color:var(--color-text-muted)]"
          >
            {line}
          </p>,
        );
      }
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      flushList();
      blocks.push(
        <hr key={`hr-${key++}`} className="my-4 border-[color:var(--color-border)]" />,
      );
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${key++}`} className="my-1.5 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
        {renderInline(line, `p-${key}`)}
      </p>,
    );
  }

  flushList();
  if (codeBuffer.length) {
    blocks.push(
      <pre
        key={`pre-${key++}`}
        className="my-3 overflow-x-auto rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-black)] p-3 font-mono text-[11.5px] text-[color:var(--color-text-muted)]"
      >
        {codeBuffer.join("\n")}
      </pre>,
    );
  }

  return <Fragment>{blocks}</Fragment>;
}
