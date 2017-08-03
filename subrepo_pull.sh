#!/bin/sh

GIT_ROOT="/c/program files/git"

export GIT_SUBREPO_ROOT=$GIT_ROOT/git-subrepo
export PATH=$GIT_ROOT/bin:$GIT_SUBREPO_ROOT/lib:$PATH"
export MANPATH=$GIT_SUBREPO_ROO/man:$MANPATH"

repo=$1

cd $repo
ls
git subrepo pull --all

