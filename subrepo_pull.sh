#!/bin/sh

export GIT_SUBREPO_ROOT="/c/program files/git/git-subrepo"
export PATH=$GIT_SUBREPO_ROOT/lib:$PATH"
export MANPATH=$GIT_SUBREPO_ROO/man:$MANPATH"

if [ -n "$1" ]
    then git checkout -B $1
fi
echo "ok"
git subrepo pull --all