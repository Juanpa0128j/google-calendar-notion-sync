node-red running on express for Glitch
=========================================================

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/node-red-glitch)

What is node-red?
=================
According to [the website](https://nodered.org/):
> Node-RED is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways.
>It provides a browser-based editor that makes it easy to wire together flows using the wide range of nodes in the palette that can be deployed to its runtime in a single-click.

But among many other things, it is in fact an *amazing tool for quick prototyping* many things.

## Getting started
- Remix this on Glitch using that subtle button above
- [Create an Oauth app on Github](https://github.com/settings/developers)
- Set your `GITHUB_USERNAME`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` and other options on the project's `.env` file
- Navigate to the home of your project (ej.`https://some-project.glitch.me`)
- Login and authorize your app with Github

### Example `.env` file
    GITHUB_USERNAME=superDevMaster9000
    GITHUB_CLIENT_ID=0zz74258441f12d583dbc
    GITHUB_CLIENT_SECRET=a5b1ebc3aa37raNDom$tuff004a7d1d01e5b36

    # To keep it alive in glitch, default: false
    KEEP_ALIVE=false
    # Anyone can view flows, default: false
    VIEW_WITHOUT_LOGIN=true
    
License
=======
MIT License

Copyright (c) 2018 Eduardo M

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.