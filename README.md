# SVG optimizer

This is just a simnple and automatic way to optimize SVG files locally.

This project lets you use SVGO with Node's runtime and the package manager NPM. This tool is good for those who occasionally use SVGOMG for optimizing vector graphics but want something more automatic.

It's also handy when you need to optimize SVGs locally without a project. I mainly use it to preoptimize SVGs that I still can edit and then i also use SVG in a project to make sure the output always is optimized and minfied.

I've kept it simple, so even if you're not super familiar with NPM, Node, or running code, you should find it easy to use. Basic knowledge of Node, NPM, a terminal, and Git is helpful, but I believe you can run this without much trouble.

## Setup

Install [Node.js](https://nodejs.org/).

### Clone or download the project

#### Using Git

```bash
git clone https://github.com/KristofferKarlAxelEkstrand/svg-optimizer.git
```

#### Using GitHub CLI

```bash
gh repo clone KristofferKarlAxelEkstrand/svg-optimizer
```

### Install packages

#### Get into folder

```bash
cd svg-optimizer
```

#### Download and install the packages

```bash
npm install
```

## Basic usage

The presets are based on two modes: clean and optimize. The clean presets are designed to make SVGs easier to read and edit by removing unnecessary elements. Some optimization is done initially, but further optimization should be performed later. Running SVGs through the clean mode can make them easier to edit and help minimize surprises when they are optimized later on.

```bash
npm run clean:default
```

## System Requirements

- [Node.js](https://nodejs.org/) 14 or later (NPM is installed together)
