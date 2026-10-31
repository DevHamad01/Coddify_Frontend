/**
 * A tiny, safe interpreter that lets the mock API "run" beginner lesson code without a backend:
 * Python `print(...)` and `name = expr`, JavaScript `console.log(...)` and `let/const/var name = expr`,
 * comments, numbers, strings (incl. Python f-strings and JS template literals), booleans,
 * + - * / // % ** and parentheses. Anything else raises a friendly error, like a real runtime would.
 * The real backend runs code in a sandbox; this exists only so the UI is fully clickable.
 */
export interface MiniRunOutput {
  readonly output: string;
  readonly error: string | null;
}

type Value = number | string | boolean | null;
type Language = 'python' | 'javascript';

class RunError extends Error {}

export function runSnippet(code: string, language: string): MiniRunOutput {
  const lang: Language =
    language === 'javascript' || language === 'typescript' ? 'javascript' : 'python';
  const vars = new Map<string, Value>();
  const out: string[] = [];
  const lines = code.replace(/\r\n/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = stripComment(lines[i], lang).trim().replace(/;$/, '');
    if (!line) {
      continue;
    }
    try {
      runLine(line, lang, vars, out);
    } catch (error) {
      const message = error instanceof RunError ? error.message : 'Something went wrong';
      const where = lang === 'python' ? `  File "main.py", line ${i + 1}\n` : `main.js:${i + 1}\n`;
      return { output: out.join('\n'), error: `${where}${message}` };
    }
  }
  return { output: out.join('\n'), error: null };
}

function runLine(line: string, lang: Language, vars: Map<string, Value>, out: string[]): void {
  const printCall = lang === 'python' ? /^print\s*\((.*)\)$/s : /^console\.log\s*\((.*)\)$/s;
  const printMatch = line.match(printCall);
  if (printMatch) {
    const args = splitArgs(printMatch[1]).map((arg) => evaluate(arg, lang, vars));
    out.push(args.map((value) => display(value, lang)).join(' '));
    return;
  }
  const assign =
    lang === 'python'
      ? line.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/)
      : line.match(/^(?:let|const|var)?\s*([A-Za-z_$][\w$]*)\s*=(?!=)\s*(.+)$/);
  if (assign) {
    vars.set(assign[1], evaluate(assign[2], lang, vars));
    return;
  }
  throw new RunError(
    `SyntaxError: the practice runner only understands simple statements: ${line}`,
  );
}

function stripComment(line: string, lang: Language): string {
  const marker = lang === 'python' ? '#' : '//';
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (line.startsWith(marker, i)) {
      return line.slice(0, i);
    }
  }
  return line;
}

function splitArgs(text: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      args.push(text.slice(start, i));
      start = i + 1;
    }
  }
  const last = text.slice(start);
  if (last.trim()) args.push(last);
  return args;
}

function display(value: Value, lang: Language): string {
  if (value === null) return lang === 'python' ? 'None' : 'null';
  if (typeof value === 'boolean')
    return lang === 'python' ? (value ? 'True' : 'False') : String(value);
  return String(value);
}

// ---- Expression parser (precedence climbing) ----

interface Token {
  readonly kind: 'num' | 'str' | 'fstr' | 'name' | 'op' | 'lparen' | 'rparen';
  readonly text: string;
}

function tokenize(src: string, lang: Language): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const fPrefix =
      lang === 'python' && (ch === 'f' || ch === 'F') && (src[i + 1] === '"' || src[i + 1] === "'");
    if (ch === '"' || ch === "'" || ch === '`' || fPrefix) {
      const quote = fPrefix ? src[i + 1] : ch;
      let j = fPrefix ? i + 2 : i + 1;
      let text = '';
      while (j < src.length && src[j] !== quote) {
        if (src[j] === '\\' && j + 1 < src.length) {
          const next = src[j + 1];
          text += next === 'n' ? '\n' : next === 't' ? '\t' : next;
          j += 2;
        } else {
          text += src[j++];
        }
      }
      if (j >= src.length) throw new RunError('SyntaxError: unterminated string literal');
      tokens.push({ kind: fPrefix || quote === '`' ? 'fstr' : 'str', text });
      i = j + 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const match = src.slice(i).match(/^\d*\.?\d+/)!;
      tokens.push({ kind: 'num', text: match[0] });
      i += match[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const match = src.slice(i).match(/^[A-Za-z_$][\w$]*/)!;
      tokens.push({ kind: 'name', text: match[0] });
      i += match[0].length;
      continue;
    }
    const op = ['**', '//', '+', '-', '*', '/', '%'].find((candidate) =>
      src.startsWith(candidate, i),
    );
    if (op) {
      tokens.push({ kind: 'op', text: op });
      i += op.length;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ kind: ch === '(' ? 'lparen' : 'rparen', text: ch });
      i++;
      continue;
    }
    throw new RunError(`SyntaxError: unexpected character '${ch}'`);
  }
  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '//': 2,
  '%': 2,
  '**': 3,
};

function evaluate(src: string, lang: Language, vars: Map<string, Value>): Value {
  const tokens = tokenize(src, lang);
  let pos = 0;

  const primary = (): Value => {
    const token = tokens[pos++];
    if (!token) throw new RunError('SyntaxError: expression ended too early');
    switch (token.kind) {
      case 'num':
        return Number(token.text);
      case 'str':
        return token.text;
      case 'fstr':
        return token.text.replace(
          lang === 'python' ? /\{([^}]+)\}/g : /\$\{([^}]+)\}/g,
          (_, inner: string) => display(evaluate(inner, lang, vars), lang),
        );
      case 'name':
        return lookup(token.text);
      case 'lparen': {
        const value = expression(0);
        if (tokens[pos++]?.kind !== 'rparen')
          throw new RunError("SyntaxError: '(' was never closed");
        return value;
      }
      case 'op':
        if (token.text === '-') return -toNumber(primary());
        throw new RunError(`SyntaxError: unexpected '${token.text}'`);
      default:
        throw new RunError(`SyntaxError: unexpected '${token.text}'`);
    }
  };

  const lookup = (name: string): Value => {
    const literals: Record<string, Value> =
      lang === 'python'
        ? { True: true, False: false, None: null }
        : { true: true, false: false, null: null };
    if (name in literals) return literals[name];
    if (vars.has(name)) return vars.get(name)!;
    throw new RunError(
      lang === 'python'
        ? `NameError: name '${name}' is not defined`
        : `ReferenceError: ${name} is not defined`,
    );
  };

  const expression = (minPrecedence: number): Value => {
    let left = primary();
    while (
      pos < tokens.length &&
      tokens[pos].kind === 'op' &&
      PRECEDENCE[tokens[pos].text] >= minPrecedence
    ) {
      const op = tokens[pos].text;
      const precedence = PRECEDENCE[op];
      pos++;
      // ** is right-associative, the rest are left-associative.
      const right = expression(op === '**' ? precedence : precedence + 1);
      left = apply(op, left, right, lang);
    }
    return left;
  };

  const value = expression(0);
  if (pos < tokens.length)
    throw new RunError(`SyntaxError: invalid syntax near '${tokens[pos].text}'`);
  return value;
}

function toNumber(value: Value): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  throw new RunError(`TypeError: expected a number, got '${String(value)}'`);
}

function apply(op: string, a: Value, b: Value, lang: Language): Value {
  if (op === '+' && (typeof a === 'string' || typeof b === 'string')) {
    if (lang === 'python' && (typeof a !== 'string' || typeof b !== 'string')) {
      throw new RunError('TypeError: can only concatenate str (not "int") to str');
    }
    return display(a, lang) + display(b, lang);
  }
  if (op === '*' && lang === 'python' && typeof a === 'string' && typeof b === 'number') {
    return a.repeat(b);
  }
  const x = toNumber(a);
  const y = toNumber(b);
  switch (op) {
    case '+':
      return x + y;
    case '-':
      return x - y;
    case '*':
      return x * y;
    case '/':
      if (y === 0 && lang === 'python') throw new RunError('ZeroDivisionError: division by zero');
      return x / y;
    case '//':
      if (y === 0) throw new RunError('ZeroDivisionError: integer division or modulo by zero');
      return Math.floor(x / y);
    case '%':
      return x % y;
    case '**':
      return x ** y;
    default:
      throw new RunError(`SyntaxError: unknown operator ${op}`);
  }
}
