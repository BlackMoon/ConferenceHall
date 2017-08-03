#!/bin/sh

export GIT_SUBREPO_ROOT="/c/program files/git/git-subrepo"
export PATH=$GIT_SUBREPO_ROOT/lib:$PATH
export MANPATH=$GIT_SUBREPO_ROOT/man:$MANPATH

git subrepo commit kit
git subrepo push --all

