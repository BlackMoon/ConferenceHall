#!/bin/sh

export GIT_SUBREPO_ROOT="/d/dev/mvc2/git-subrepo"
export PATH=$GIT_SUBREPO_ROOT/lib:$PATH"
export MANPATH=$GIT_SUBREPO_ROO/man:$MANPATH"

#git subrepo clone http://portal:8080/tfs/ntcGroup/ntcProjects/_git/kit kit -b netcore1.1
git subrepo pull --all