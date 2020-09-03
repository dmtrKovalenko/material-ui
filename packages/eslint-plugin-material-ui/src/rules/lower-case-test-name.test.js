/* eslint-disable no-template-curly-in-string */
const eslint = require('eslint');
const rule = require('./lower-case-test-name');

const ruleTester = new eslint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' },
});
ruleTester.run('lower-case-test-name', rule, {
  valid: [
    'it("adds something", () => {})',
    "it('adds something', () => {})",
    'it(`adds something`, () => {})',
    'it(variable, () => {})',
    'it(`${something} is tested`, () => {})',
  ],
  invalid: [
    {
      code: "it('AddsSomething', () => {})",
      errors: [
        {
          message: 'Test name must be lowercase',
        },
      ],
      output: "it('addsSomething', () => {})",
    },
    {
      code: `
      it('Allows to select edge years from list', () => {
        render(null);

        fireEvent.click(screen.getByText('2010', { selector: 'button' }));
        expect(getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
      });
    `,
      errors: [
        {
          message: 'Test name must be lowercase',
        },
      ],
      output: `
      it('allows to select edge years from list', () => {
        render(null);

        fireEvent.click(screen.getByText('2010', { selector: 'button' }));
        expect(getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
      });
    `,
    },
    {
      code: ['it(`Some template ${literal} name`, () => {', '});'].join('\n'),
      errors: [
        {
          message: 'Test name must be lowercase',
        },
      ],
      output: ['it(`some template ${literal} name`, () => {', '});'].join('\n'),
    },
  ],
});
