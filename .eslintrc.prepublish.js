/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: './.eslintrc.js',

	rules: {
		'n8n-nodes-base/community-package-json-name-still-default': 'error',
		'n8n-nodes-base/node-class-description-outputs-wrong-regular-node': 'off',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
	},
};
