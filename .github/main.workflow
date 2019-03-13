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
#  needs = "tag"
  uses = "actions/npm@master"
  args = "install"
}

action "install-build" {
#  needs = "tag"
  uses = "actions/npm@master"
  args = "install --prefix build"
}

action "build" {
  needs = ["install-root","install-build"]
  uses = "actions/npm@master"
  args = "build"
}

action "publish" {
  needs = "build"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}