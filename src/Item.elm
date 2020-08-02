module Item exposing
    ( Item
    , decode
    , encode
    , isCompleted
    , isDeleted
    , setCompletedAt
    , setDeletedAt
    , setDescription
    , unsetCompletedAt
    , unsetDeletedAt
    , view
    )

import Html exposing (Html, button, div, input, label, li, text)
import Html.Attributes exposing (attribute, checked, class, classList, placeholder, type_, value)
import Html.Drag exposing (onDragEnd, onDragOver, onDragStart, onDrop)
import Html.Events exposing (onCheck, onClick, onInput)
import Id exposing (Id)
import Json.Decode as D
import Json.Decode.Extra as DD
import Json.Encode as E
import Json.Encode.Extra as EE
import Maybe exposing (Maybe(..))
import Maybe.Extra exposing (isJust)
import Msg exposing (Msg(..))
import Time exposing (Posix)


type alias Item =
    { id : Id
    , description : String
    , createdAt : Posix
    , completedAt : Maybe Posix
    , deletedAt : Maybe Posix
    }


setDescription : String -> Item -> Item
setDescription description item =
    { item | description = description }


setCompletedAt : Maybe Posix -> Item -> Item
setCompletedAt completedAt item =
    { item | completedAt = completedAt }


unsetCompletedAt : Item -> Item
unsetCompletedAt =
    setCompletedAt Nothing


setDeletedAt : Maybe Posix -> Item -> Item
setDeletedAt deletedAt item =
    { item | deletedAt = deletedAt }


unsetDeletedAt : Item -> Item
unsetDeletedAt =
    setDeletedAt Nothing


isDeleted : Item -> Bool
isDeleted =
    isJust << .deletedAt


isCompleted : Item -> Bool
isCompleted =
    isJust << .completedAt


encode : Item -> E.Value
encode item =
    E.object
        [ ( "id", E.string item.id )
        , ( "description", E.string item.description )
        , ( "createdAt", EE.posix item.createdAt )
        , ( "completedAt", EE.maybe EE.posix item.completedAt )
        , ( "deletedAt", EE.maybe EE.posix item.deletedAt )
        ]


decode : D.Decoder Item
decode =
    D.map5 Item
        (D.field "id" D.string)
        (D.field "description" D.string)
        (D.field "createdAt" DD.posix)
        (D.field "completedAt" (D.maybe DD.posix))
        (D.field "deletedAt" (D.maybe DD.posix))


itemCompletedView : Id -> Maybe Posix -> Html Msg
itemCompletedView id completedAt =
    div [ class "List--Item--Completed" ]
        [ input
            [ type_ "checkbox"
            , checked (isJust completedAt)
            , onCheck (ItemCompletedChange id)
            , Html.Attributes.id id
            ]
            []
        , label [ Html.Attributes.for id ] []
        ]


itemDescriptionView : Id -> String -> Html Msg
itemDescriptionView id description =
    input
        [ type_ "text"
        , class "List--Item--Description"
        , onInput (ItemDescriptionChange id)
        , value description
        , placeholder "milk or eggs or chocolate"
        ]
        []


itemDeletedView : Id -> Maybe Posix -> Html Msg
itemDeletedView id _ =
    button
        [ class "List--Item--Deleted"
        , onClick (ItemDeleteClick id)
        ]
        [ text "❌" ]


view : Item -> Html Msg
view item =
    li
        [ class "List--Item"
        , classList
            [ ( "_deleted", isJust item.deletedAt )
            , ( "_completed", isJust item.completedAt )
            ]
        , attribute "draggable" "true"
        , onDragStart (ItemDragStart item.id)
        , onDragEnd (ItemDragEnd item.id)
        , onDragOver (ItemDragOver item.id)
        , onDrop (ItemDrop item.id)
        ]
        [ itemCompletedView item.id item.completedAt
        , itemDescriptionView item.id item.description
        , itemDeletedView item.id item.deletedAt
        ]
