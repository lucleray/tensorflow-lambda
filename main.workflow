workflow "build and publish" {
  on = "push"
  resolves = ["publish"]
}

action "tag" {
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "build" {
  needs = "tag"
  uses = "docker://lambci/lambda:build-nodejs8.10"
  runs = ["./scripts/build.sh"]
}

action "publish" {
  needs = "build"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
