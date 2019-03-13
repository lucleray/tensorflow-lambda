workflow "build, publish" {
  on = "push"
  resolves = ["publish"]
}

# Filter for a new tag
# action "tag" {
#   uses = "actions/bin/filter@master"
#   args = "tag"
# }

action "install-root" {
  needs = "tag"
  uses = "nuxt/actions-yarn@master"
  args = "install"
}

action "install-build" {
  needs = "tag"
  uses = "nuxt/actions-yarn@master"
  args = "--cwd build install"
}

action "build" {
  needs = ["install-root","install-build"]
  uses = "nuxt/actions-yarn@master"
  args = "build"
}

action "publish" {
  needs = "build"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}