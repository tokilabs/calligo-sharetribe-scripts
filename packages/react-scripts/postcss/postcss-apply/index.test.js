const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('Removes Property Set declarations from output and adds content to correct elements', async () => {

  const input = `
/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

:root {
  --color-black: black;
  /* should be removed */
  --toolbar-theme: {
    background-color: hsl(120, 70%, 95%);
    border-radius: 4px;
    border: 1px solid var(--theme-color late);

    @media (--viewportMedium) {
      font-size: 64px;
      line-height: 64px;
      letter-spacing: -1.5px;
      margin-top: 25px;
      margin-bottom: 23px;
    }
  }
  --toolbar-title-theme: {
    color: green;
  }
  --color-dark: #666666;
  --color-light: #f1f1f1;
  --with-parens: {
    color: tomato;
  }
  --blaa: {
    color: green;
  };
  --blaa2 {
    color: green;
  };
  --nested-set-one: {
    @apply --toolbar-theme;
  }
  --color-white: white;
  --nested-set-two: {
    @apply --with-parens;
    @apply --toolbar-title-theme;

    color: orange;
  }
}

.toolbar {
  @apply --toolbar-theme;
}

.toolbar > .title {
  @apply --toolbar-title-theme;
}

.with-parens {
  @apply (--with-parens);
}

.nested-set-one {
  @apply --nested-set-one;
}

.nested-set-two {
  @apply --nested-set-two;
}

.nested-deeper {
  @media screen {
    @apply --toolbar-theme;
  }
}

@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
  }
}

#main {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
`;

  const output = `
/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

:root {
  --color-black: black;
  --color-dark: #666666;
  --color-light: #f1f1f1;
  --color-white: white;
}

.toolbar {
  background-color: hsl(120, 70%, 95%);
  border-radius: 4px;
  border: 1px solid var(--theme-color late);

    @media (--viewportMedium) {
      font-size: 64px;
      line-height: 64px;
      letter-spacing: -1.5px;
      margin-top: 25px;
      margin-bottom: 23px;
    }
}

.toolbar > .title {
  color: green;
}

.with-parens {
  color: tomato;
}

.nested-set-one {
  background-color: hsl(120, 70%, 95%);
  border-radius: 4px;
  border: 1px solid var(--theme-color late);

    @media (--viewportMedium) {
      font-size: 64px;
      line-height: 64px;
      letter-spacing: -1.5px;
      margin-top: 25px;
      margin-bottom: 23px;
    }
}

.nested-set-two {
  color: tomato;
  color: green;

  color: orange;
}

.nested-deeper {
  @media screen {
  background-color: hsl(120, 70%, 95%);
  border-radius: 4px;
  border: 1px solid var(--theme-color late);

    @media (--viewportMedium) {
      font-size: 64px;
      line-height: 64px;
      letter-spacing: -1.5px;
      margin-top: 25px;
      margin-bottom: 23px;
    }
  }
}

@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
  }
}

#main {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
`;

  await run(input, output, { })
})

it('Removes Property Set (rule syntax) from output and adds content to correct elements', async () => {

  const input = `
:root {
  --color-white: white;
  --nested-set-two {
    color: orange;
  };
}
`;

  const output = `
:root {
  --color-white: white;
}
`;

  await run(input, output, { })
})


async function runControl (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.messages.length).toBeGreaterThan(0);
  expect(result.messages[0].type).toBe('warning');
}


it('Removes wrongly set Property Set declarations', async () => {

  const input = `
:root {
  --should-be-removed: {
    content: 'gone';
  }
}

.should-warn--not-root {
  --wrong-placement: {
    color: green;
  }
}
.toolbar {
  @apply --wrong-placement;
}

.some-other-apply {
  @apply blaa;
}

.should-warn--not-declared {
  @apply --this-should-warn;
}
@media screen {
  @apply --toolbar-theme;
}
--should-warn-about-root-scope-and-be-removed: {
  color: green;
}
@apply --should-warn-about-root-scope-and-be-removed;
`;
const output = `
.should-warn--not-root {
  --wrong-placement: {
    color: green;
  }
}
.toolbar {
  @apply --wrong-placement;
}

.some-other-apply {
  @apply blaa;
}

.should-warn--not-declared {
  @apply --this-should-warn;
}
@media screen {
}
`;

  await runControl(input, output, { })
})

it('Removes wrongly set Property Set declarations (rule syntax)', async () => {

  const input = `
:root {
  --should-be-removed {
    content: 'gone';
  }
}

.should-warn--not-root {
  --wrong-placement-2 {
    color: green;
  }
}
.toolbar {
  @apply --wrong-placement-2;
}

.should-warn--not-declared {
  @apply --this-should-warn;
}
--should-warn-about-root-scope-and-be-removed: {
  color: green;
}
@apply --should-warn-about-root-scope-and-be-removed;
`;

const output = `
.should-warn--not-root {
  --wrong-placement-2 {
    color: green;
  }
}
.toolbar {
  @apply --wrong-placement-2;
}

.should-warn--not-declared {
  @apply --this-should-warn;
}
`;

  await runControl(input, output, { })
})
