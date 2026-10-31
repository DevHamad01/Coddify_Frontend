import { runSnippet } from './mini-runner';

describe('runSnippet', () => {
  it('prints Python strings, numbers and expressions', () => {
    const result = runSnippet('# hi\nprint("Hello Python!")\nprint(2 + 3 * 4, 2 ** 3)', 'python');
    expect(result).toEqual({ output: 'Hello Python!\n14 8', error: null });
  });

  it('supports variables and f-strings', () => {
    const result = runSnippet('name = "Ayesha"\nage = 20\nprint(f"{name} is {age + 1}")', 'python');
    expect(result.output).toBe('Ayesha is 21');
  });

  it('reports a NameError with the line number', () => {
    const result = runSnippet('print("ok")\nprint(missing)', 'python');
    expect(result.output).toBe('ok');
    expect(result.error).toContain('line 2');
    expect(result.error).toContain("NameError: name 'missing' is not defined");
  });

  it('runs console.log with template literals in JavaScript', () => {
    const result = runSnippet(
      'const n = 3; // count\nconsole.log(`n = ${n * 2}`, true)',
      'javascript',
    );
    expect(result).toEqual({ output: 'n = 6 true', error: null });
  });

  it('keeps operator precedence and associativity', () => {
    expect(runSnippet('print(10 - 4 - 3, 2 ** 3 ** 2, 7 // 2, 7 % 4)', 'python').output).toBe(
      '3 512 3 3',
    );
  });
});
