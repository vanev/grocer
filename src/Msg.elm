module Msg exposing (Msg(..))

import Id exposing (Id)
import Time exposing (Posix)


type Msg
    = ListNameChange String
    | CreateItemClick
    | CreateItemTimestamp Posix
    | ItemDescriptionChange Id String
    | ItemCompletedChange Id Bool
    | ItemCompletedTimestamp Id Posix
    | ItemDeleteClick Id
    | ItemDeleteTimestamp Id Posix
    | ItemDragStart Id
    | ItemDragEnd Id
    | ItemDragOver Id
    | ItemDrop Id
