<label class="tweet-main">
  <textarea id="tweet-box" class="tweet-box" bind:value="text" on:input="count()" on:paste="addImage(event)" on:keydown="keyDown(event)"></textarea>
  <span id="text-count" class="text-count {{ text.length > 140 ? 'invalid' : '' }}">{{ textCount }}</span>
</label>

<ul id="image-list">
{{ #each images as image, index }}
  <li>
    <img class="post-image" src="{{ image }}" alt="" on:click="removeImage(index)">
  </li>
{{ /each }}
</ul>
<button id="post-button" class="post-button" on:click="post()">POST</button>

<style>
  ul {
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    padding: 0;
  }

  li {
    width: 23%;
  }

  img {
    max-width: 100%;
  }

  .tweet-main {
    display: flex;
    align-items: flex-end;
  }

  .tweet-box {
    resize: none;
    width: 350px;
    height: 100px;
  }

  .post-button {
    float: right;
  }

  .text-count {
    width: 50px;
    text-align: center;
    color: black;
  }

  .invalid {
    color: red;
  }
</style>

<script>
  import * as Chrome from '../../utils/chrome/index'

  export default {
    data() {
      return {
        text: '',
        images: [],
        textCount: 140,
      }
    },

    methods: {
      addImage(event) {
        if (event.clipboardData.types[0] !== 'Files') {
          return
        }

        event.preventDefault()

        const fr = new FileReader()
        fr.onload = e => {
          const images = this.get('images')
          if (images.length >= 4) {
            return
          }

          this.set({
            images: [...images, e.target.result]
          })
        }
        for (const item of event.clipboardData.files) {
          fr.readAsDataURL(item)
        }
      },

      removeImage(index) {
        const images = this.get('images')
        images.splice(index, 1)

        this.set({
          images
        })
      },

      count() {
        const { text } = this.get()
        console.log(text)

        this.set({
          textCount: 140 - text.length
        })
      },

      keyDown(event) {
        if (event.key === 'Enter' && event.metaKey) {
          this.post()
        }
      },

      post() {
        const { consumer_key, consumer_secret } = require('../../../config')
        const { access_token, access_token_secret } = store.get('users')[store.get('current_user_id')]

        Chrome.Runtime.sendMessage({
          keys: {
            consumer_key,
            consumer_secret,
            access_token_key: access_token,
            access_token_secret,
          },
          tweet: {
            status: this.get('text'),
            media: this.get('images').map(image => image.split(',')[1]),
          },
        })

        this.set({
          text: '',
          images: [],
        })
      },
    },
  }
</script>
