![](assets/screenshot.png)
![](assets/transition.gif)

# DSSSP

[![npm latest package](https://img.shields.io/npm/v/dsssp/latest.svg)](https://www.npmjs.com/package/dsssp)
[![npm downloads](https://img.shields.io/npm/dt/dsssp.svg)](https://www.npmjs.com/package/dsssp)
[![gzipped](https://img.shields.io/bundlejs/size/dsssp)](https://www.npmjs.com/package/dsssp)

## React Library for Audio Processing and Visualization

[DSSSP](https://dsssp.io) is a React component library for visualizing and editing audio filters. These components are designed to serve as the core UI elements of audio production tools and interfaces, enabling users to interactively configure all filter parameters. Essentially, it is a conversion of proprietary audio processing and visualization tools from professional desktop software to a web-based environment.

The library's rendering system is based on SVG and provides a logarithmic frequency graph for audio spectrum representation, a set of components to render and manipulate biquad filters, and mathematical functions to calculate the resulting signal curve. Filters support **drag-and-drop** and **mouse wheel** interactions, direct property updates (**Gain**, **Frequency**, **Q-Factor**), **animated transitions** between curves, and implement common audio filter types.

## Installation

Install the package in your project directory with:

```bash
npm install dsssp
```

## Documentation

Visit [dsssp.io/docs](https://dsssp.io/docs/) to view the full documentation.

## Examples

Our documentation includes a full-scale [demo project](https://github.com/NumberOneBot/dsssp-demo) that showcases each library component across various use cases and provides a starting point for your own projects.

Visit the [dsssp.io/demo](https://dsssp.io/demo/) to see it live.

## License

[MIT](LICENSE) © Oleksiy Strelets — free to use in personal, open-source, and commercial projects.

## Contact

If you have any questions or feedback, reach out to the author at [alex.strelets@gmail.com](mailto:alex.strelets@gmail.com).
