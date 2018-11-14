<div class="modal">

  <input type="checkbox" id="modalCheck" class="modal-check">
  <div class="modal-overlay">
    <label class="modal-close" for="modalCheck"></label>
    <div class="modal-content">
      <div class="modal-body">
        <label>
          PIN:
          <input type="text" bind:value="pin">
        </label>
      </div>
      <div class="modal-footer">
        <button on:click="post()">OK</button>
      </div>
    </div>
  </div>
</div>

<style>
.modal-check {
  display: none;
}

.modal-overlay {
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}

.modal-check:checked + .modal-overlay {
  display: flex;
}

.modal-close {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}


.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 101;
  background-color: white;
  width: 600px;
  height: 300px;
  transform: translate(-50%, -50%);
}

.modal-body {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.modal-body label {
  font-size: 30px;

}

.modal-body input {
  font-size: 30px;
  width: 3.5em;
}

.modal-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}

.modal-footer button {
  display: inline-block;
  padding: 0.3em 1em;
  text-decoration: none;
  color: deepskyblue;
  border: solid 2px deepskyblue;
  border-radius: 3px;
  font-size: 20px;
  height: 40px;
  width: 100px;
  margin-bottom: 10px;
}

.modal-footer button:hover {
  cursor: pointer;
}
</style>

<script>
import { browser } from 'webextension-polyfill-ts'

import config from '../../../config'

const { consumer_key, consumer_secret } = config

export default {
  data() {
    return {
      pin: '',
    }
  },

  methods: {
    async post() {
      const { tokens: { oauthToken, oauthTokenSecret } } = await browser.storage.local.get(['tokens'])
      const oauth_verifier = this.get().pin

      await browser.runtime.sendMessage({
        type: 'GetAccessToken',
        data: {
          consumer_key,
          consumer_secret,
          oauthToken,
          oauthTokenSecret,
          oauth_verifier
        },
      })
    }
  },
}
</script>
