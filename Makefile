install:
	npm ci
lint:
	npx eslint .
run:
	bin/hexlet-fs.js
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8

