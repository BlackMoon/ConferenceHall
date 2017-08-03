#!/bin/sh

GIT_ROOT="/c/program files/git"

export GIT_SUBREPO_ROOT=$GIT_ROOT/git-subrepo
export PATH=$GIT_ROOT/bin:$GIT_SUBREPO_ROOT/lib:$PATH"
export MANPATH=$GIT_SUBREPO_ROO/man:$MANPATH"

if [ -n "$1" ]
    then git checkout --progress -B $1 
fi

git subrepo pull --all