# postcss-apply

[PostCSS] plugin - customized private version of postcss-apply.

[PostCSS]: https://github.com/postcss/postcss

```css
/* input */

:root {
  --toolbar-theme: {
    background-color: rebeccapurple;
    color: white;
    border: 1px solid green;
  };
}

.Toolbar {
  @apply --toolbar-theme;
}
```

```css
/* output */

.Toolbar {
  background-color: rebeccapurple;
  color: white;
  border: 1px solid green;
}
```

## Usage

This is a private plugin for sharetribe-scripts

## Develop

Copy index.js, index.test.js, visitor.js to a fresh postcss plugin template and include also balanced-match as dependency: `"balanced-match": "^2.0.0",`.

NOTE: you should avoid developing this plugin futher, since CSS Property Set syntax will not be supported by W3C.
