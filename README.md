# sunset clock

I saw a [clock in Prague](https://en.wikipedia.org/wiki/Prague_astronomical_clock)
that starts a new day at sunset.  When I looked it up I found out this is sometimes
called 

After doing a bit of research, I found out that that is called
[Italian hours](https://en.wikipedia.org/wiki/Hour#Counting_from_sunset)

I thought it would be handy to have a clock like this for my desktop and one
for my phone so that I knew more or less how much time I had left to play
frisbee.

It looks something like [this](https://alex028502.github.io/sunset-clock/)

While the clock in Prague seems to rotate the numbers so that the 0/24 is always
at sunset, this clock always reaches the top a half hour after Sunset, and has
no numbers.

#### platform

To make this, I took the oportunity to mess around with progressive web apps,
electron, redux, github pages, nyc, gulp, async/await, and travis.

#### challenges

The biggest challenge was testing the service worker.  I needed to create a dev
server that could change source files during tests and use a selenium test to
see if it updated when we thought it should, and loaded with the server turned
off.

#### android version

To try the android version, open [this](https://alex028502.github.io/sunset-clock/)
on your phone.  If you give it permission, it should be able to detect your
location.  If you return a few times, it should offer to add the app to your
desktop.

#### desktop version

To use the desktop version, you have to build it locally.

Also the desktop version doesn't detect your location.  You have to configure
it on another screen.

##### ubuntu (probably just unity)
```bash
npm install
npm package
cat ./install-on-ubuntu-64.sh # read carefully before trying
./install-on-ubuntu-64.sh
```

##### macintosh
```bash
npm install
npm run mac-package
# then look around for the .app folder and drag it into your apps
```

#### interested bits of code
(that I might need to copy later)

* [makefile](./makefile) to generate pwa images
* [gulpfile](./gulpfile.js) that watches files and runs dev server
* [travis file](./.travis.yml) that deploys to github pages
* [service worker](./src/service-worker.js) that shows a splash page while
service worker is installing, and then takes you to the app when it is done, and
then always servs app from the cache until it is updated
* [selenium tests](tests/e2e/browser/index.js) for the service worker, using
no test framework, and a [demo server](./demo) that changes the content of the
files served.  It also shows how to use [server-destroy](./demo/index.js) to
allow the tests to turn off the server immediately.
* using a [docker image](./scripts/serve.sh) that serves the files over https with nginx, and auto generates the self signed certificates for testing on an
ios device over the lan
* a [wrapper](./src/lib/format-coordinates.js) for the `formatcoords` library
that corrects an issue with rounding off. see [tests](./tests/unit/small-units/format-coordinates.js) for details
* a pattern for wrapping redux inside the
[top level react component](./src/clock-app.js) which is almost like not using
redux, except that you can use reducers, and the time travel debugger.
