module Ordering exposing
    ( Ordering
    , add
    , append
    , cons
    , insertAfter
    , insertBefore
    , prepend
    , snoc
    )

import Id exposing (Id)
import List.Extra


type alias Ordering =
    List Id


add : Id -> Ordering -> Ordering
add newId ordering =
    if List.member newId ordering then
        ordering

    else
        ordering ++ [ newId ]


cons : Id -> Ordering -> Ordering
cons newId ordering =
    newId :: List.filter (\id -> id /= newId) ordering


snoc : Id -> Ordering -> Ordering
snoc newId ordering =
    List.filter (\id -> id /= newId) ordering ++ [ newId ]


append : Ordering -> Ordering -> Ordering
append new target =
    List.filter (\id -> not <| List.member id new) target ++ new


prepend : Ordering -> Ordering -> Ordering
prepend new target =
    new ++ List.filter (\id -> not <| List.member id new) target


elemIndex : Id -> Ordering -> Int
elemIndex id ordering =
    List.Extra.elemIndex id ordering
        |> Maybe.withDefault (List.length ordering)


insertBefore : Id -> Id -> Ordering -> Ordering
insertBefore targetId newId ordering =
    let
        index =
            elemIndex targetId ordering

        ( init, tail ) =
            List.Extra.splitAt index ordering
    in
    append (cons newId tail) init


insertAfter : Id -> Id -> Ordering -> Ordering
insertAfter targetId newId ordering =
    let
        index =
            elemIndex targetId ordering

        ( init, tail ) =
            List.Extra.splitAt (index + 1) ordering
    in
    append (cons newId tail) init
