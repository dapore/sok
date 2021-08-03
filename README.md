# Search Engine powered by AWS S3

## Description

This library will automatically build an index for your data on AWS S3

### Usage

```js
import createSearchClient from '@dapore/sok'

const s3Config = {
  credential: {
    accessKeyId: '*********', // AWS access key id with S3 read and write access
    secretAccessKey: '*******' // AWS secret key
  },
  bucket: 'find-service-data', // a bucket accessible by the IAM user whose credentials have been provided above. You will have to create this bucket manually.
  region: 'us-east-1' // The region of the s3 bucket
}

const searchOptions = {
  rawPath: 'raw',
  variant: 'variant',
  caseSensitive: true,
}
const searchClient = createSearchClient({ s3: s3Config, searchOptions })

const indexName = 'student-index' // This is the index a

const sampleItemToBeIndexed = {
  symbol: 'AED',
  name: 'United Arab Emirates Dirham',
  rounding: 0,
  code: 'AED',
  name_plural: 'UAE dirhams'
}
// Async/Await is supported out of the box
await index.addObjects(sampleItemToBeIndexed) // Add an item to the index
await index.search('united') // this will return matches results in an acceptable amount of time
await index.clean() // This will delete all items on the index

```
### Tasks

Primary development tasks are defined under `scripts` in `package.json`
and available via `yarn run`.
View them with

```
$ yarn run
```
## License

This npm package is Copyright (c) 2016-2017 Dapore Global.

## Warranty

This software is provided by the copyright holders and contributors 'as is' and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall the copyright holder or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused and on
any theory of liability, whether in contract, strict liability, or tort
(including negligence or otherwise) arising in any way out of the use of this
software, even if advised of the possibility of such damage.
