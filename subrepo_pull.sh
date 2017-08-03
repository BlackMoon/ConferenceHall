#!/bin/sh

GIT_ROOT="/c/program files/git"

export GIT_SUBREPO_ROOT=$GIT_ROOT/git-subrepo
export PATH=$GIT_ROOT/bin:$GIT_SUBREPO_ROOT/lib:$PATH"
export MANPATH=$GIT_SUBREPO_ROO/man:$MANPATH"

# [2>&1] special flag for tfs build
if [ -n "$1" ]
echo "ok"	
    then git checkout --progress -B $1 2>&1 | Write-Host
fi

git subrepo pull --all