const Visitor = require('./visitor.js');

const creator = opts => {
	return {
		postcssPlugin: 'postcss-apply',
		prepare () {
      const visitor = new Visitor(opts);

      return {
        Once: (root, helpers) => {
          const { result } = helpers;
          visitor.result = result;

          /**
           * Transform each Declaration
           * In PostCSS v8 Property Sets are declarations
           * 
           * Syntax:
           * --blaa2: {
           *   color: green;
           * };
           */
          root.walkDecls(decl => {
            visitor.collect(decl, helpers);
          });

          /**
           * If wrong syntax is used originally:
           * --blaa2 {
           *   color: green;
           * };
           */
          root.walkRules(rule => {
            visitor.collectRules(rule, helpers)
          });

          // Check what's in the cache at this point
          // Object.keys(visitor.cache).forEach(k => console.log(k))

          visitor.resolveNested();
        },
        AtRule: {
          apply: visitor.resolve,
        }
      };
		}
	}
}

creator.postcss = true

module.exports = creator
