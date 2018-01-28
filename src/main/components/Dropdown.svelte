{{ #if isShow }}
<div class="dropdown" on:click="hide()">
  <ul>
  {{ #each sortedUsers as [userId, user], index }}
      <li class="{{ userId === $currentUserId ? 'logged-in' : '' }}" on:click="change(index)">@{{ user.screenName }}</li>
  {{ /each }}
  </ul>
</div>
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
      }
    },
  }
</script>
