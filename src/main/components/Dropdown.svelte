{{ #if isShow }}
<div class="dropdown">
  <ul>
  {{ #each sortedUsers as [userId, user], index }}
      <li class="{{ userId === $currentUserId ? 'logged-in' : '' }}" on:click="change(index)">@{{ user.screenName }}</li>
  {{ /each }}
  </ul>
</div>

<div id="overlay" class="overlay" on:click="hide()"></div>
{{ else }}
<div class="dropdown">
  <span class="logged-in" on:click="show()">@{{ $users[$currentUserId].screenName }} <i class="fa fa-caret-down" aria-hidden="true"></i></span>
</div>
{{ /if }}

<style>
  .dropdown {
    position: absolute;
    left: 76px;
    top: 8px;
    z-index: 2000;
  }

  .dropdown:hover {
    cursor: default;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    position: relative;
    left: -5px;
    padding: 0 5px 0 5px;
    background-color: lightgrey;
  }

  .logged-in {
    font-weight: bold;
  }

  li:hover {
    background-color: cornflowerblue;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0;
    z-index: 1000;
    background-color: green;
  }
</style>

<script>
  import * as Chrome  from '../../utils/chrome'

  export default {
    data() {
      return {
        isShow: false,
      }
    },

    computed: {
      sortedUsers($users) {
        return Object.entries($users).filter(([k, ]) => k !== 'currentUserId').sort(([, v], [, v2]) => v.orderBy - v2.orderBy)
      }
    },

    methods: {
      show() {
        this.set({
          isShow: true,
        })
      },

      hide() {
        this.set({
          isShow: false,
        })
      },

      async change(index) {
        const { users } = await Chrome.Storage.Local.get('users')
        const changedUserId = this.get().sortedUsers[index][0]

        await Chrome.Storage.Local.set({
          users: Object.assign(users, {
            currentUserId: changedUserId
          })
        })

        this.store.set({
          currentUserId: changedUserId
        })

        this.hide()
      }
    },
  }
</script>
