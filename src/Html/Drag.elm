module Html.Drag exposing (onDragEnd, onDragOver, onDragStart, onDrop)

import Html exposing (Attribute)
import Html.Events exposing (on, preventDefaultOn)
import Json.Decode exposing (succeed)


onDragStart : m -> Attribute m
onDragStart =
    on "dragstart" << succeed


onDragEnd : m -> Attribute m
onDragEnd =
    on "dragend" << succeed


onDragOver : m -> Attribute m
onDragOver msg =
    preventDefaultOn "dragover" <|
        succeed ( msg, True )


onDrop : m -> Attribute m
onDrop msg =
    preventDefaultOn "drop" <|
        succeed ( msg, True )
