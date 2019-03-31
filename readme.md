## tfjs-lambda

## Usage

```js
const loadTf = require('tfjs-lambda')

const tf = await loadTf()

// ... do something with tf
```

## How it works ?

The package contains a zipped and compressed version of all the dependencies and binaries needed to run `@tensorflow/tfjs-node` on AWS Lambda (these dependencies are built with Github Actions).

During cold start, the files are deflated in `/tmp` and required in your node program.

## Motivation

`@tensorflow/tfjs` works with AWS Lambda but the main problem is that it is slow very slow when used in node. On the other hand, `@tensorflow/tfjs-node` is fast when used with node but it is >140mo and it does not fit under AWS Lambda's size limit (50mo) and it needs to be pre-compiled for lambda for it to work in a lambda environment.

I was looking for an easy way to use tensorflowjs with lambda and I couldn't find any, so I made this package.
