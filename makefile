.SILENT:

PACKAGE_VERSION=$(shell cat package.json | grep -i version | sed -e "s/ //g" | cut -c 12- | sed -e "s/\",//g")

.PHONY: install
install:
	yarn install

.PHONY: build
build:
	yarn run build

.PHONY: lint
lint:
	yarn run lint

.PHONY: npmjs
npmjs:
	echo "//registry.npmjs.org/:_authToken=$$NPM_TOKEN" >> .npmrc
	echo "@hecht-a:registry=https://registry.npmjs.org/" >> .npmrc

.PHONY: publish-npmjs
publish-npmjs:
	yarn publish --access public --registry https://registry.npmjs.org/ --new-version $(PACKAGE_VERSION) --non-interactive

.PHONY: github-tag
github-tag:
	git tag -a v$(PACKAGE_VERSION) -m "update to v$(PACKAGE_VERSION)"
	git push origin v$(PACKAGE_VERSION)

.PHONY: types
types:
	yarn run types