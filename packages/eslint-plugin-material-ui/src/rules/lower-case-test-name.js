/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    fixable: 'code',
    messages: {
      lowerCase: 'Test name must be lowercase',
    },
  },
  create(context) {
    return {
      /**
       * @param {import('estree').CallExpression} node
       */
      CallExpression(node) {
        const {
          arguments: [firstArgument],
          callee,
        } = node;

        function checkTestNameNode(testName, [rangeStart]) {
          const [firstCharacter] = testName;

          if (typeof testName === 'string' && /[A-Z]/.test(firstCharacter)) {
            context.report({
              messageId: 'lowerCase',
              node: firstArgument,
              fix: (fixer) => {
                return fixer.replaceTextRange(
                  // +1 avoid quote, +2 includes the first character
                  [rangeStart + 1, rangeStart + 2],
                  firstCharacter.toLowerCase(),
                );
              },
            });
          }
        }

        if (callee.type === 'Identifier' && callee.name === 'it') {
          if (firstArgument.type === 'Literal') {
            checkTestNameNode(firstArgument.value, firstArgument.range);
          }

          if (firstArgument.type === 'TemplateLiteral' && firstArgument.quasis.length > 0) {
            const startPartOfTestNameLiteral = firstArgument.quasis[0].value.raw;
            checkTestNameNode(startPartOfTestNameLiteral, firstArgument.quasis[0].range);
          }
        }
      },
    };
  },
};

module.exports = rule;
