#!/bin/sh
npm run build
rm -fr ../css
rm -fr ../fonts
rm -fr ../js
rm -fr ../img
mv dist/* ..
rm -fr dist
