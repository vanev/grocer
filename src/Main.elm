module Main exposing (main)

import Browser exposing (element)
import Dict exposing (Dict, insert, size, values)
import Html exposing (Html, button, div, input, li, text, ul)
import Html.Attributes exposing (checked, placeholder, type_, value)
import Html.Events exposing (onCheck, onClick, onInput)
import List exposing (map)
import Maybe.Extra exposing (isJust)
import String exposing (fromInt)
import Task
import Time


type alias Id =
    String


type alias Item =
    { id : Id
    , description : String
    , createdAt : Time.Posix
    , completedAt : Maybe Time.Posix
    }


type alias Model =
    { name : String
    , items : Dict Id Item
    }


initial : Model
initial =
    { name = ""
    , items = Dict.empty
    }


type Msg
    = ListNameChange String
    | CreateItemClick
    | CreateItemTimestamp Time.Posix
    | ItemDescriptionChange Id String
    | ItemCompletedChange Id Bool
    | ItemCompletedTimestamp Id Time.Posix


withCmdNone : Model -> ( Model, Cmd Msg )
withCmdNone model =
    ( model, Cmd.none )


handleListNameChange : String -> Model -> ( Model, Cmd Msg )
handleListNameChange name model =
    { model | name = name }
        |> withCmdNone


handleCreateItemClick : Model -> ( Model, Cmd Msg )
handleCreateItemClick model =
    ( model, Task.perform CreateItemTimestamp Time.now )


handleCreateItemTimestamp : Time.Posix -> Model -> ( Model, Cmd Msg )
handleCreateItemTimestamp timestamp model =
    let
        id =
            fromInt (size model.items)

        newItem =
            Item id "" timestamp Nothing

        items =
            insert id newItem model.items
    in
    { model | items = items }
        |> withCmdNone


handleItemDescriptionChange : Id -> String -> Model -> ( Model, Cmd Msg )
handleItemDescriptionChange id description model =
    let
        setDescription item =
            { item | description = description }

        items =
            Dict.update id (Maybe.map setDescription) model.items
    in
    { model | items = items }
        |> withCmdNone


handleItemCompletedChange : Id -> Bool -> Model -> ( Model, Cmd Msg )
handleItemCompletedChange id checked model =
    if checked then
        ( model, Task.perform (ItemCompletedTimestamp id) Time.now )

    else
        let
            setCompletedAt item =
                { item | completedAt = Nothing }

            items =
                Dict.update id (Maybe.map setCompletedAt) model.items
        in
        { model | items = items }
            |> withCmdNone


handleItemCompletedTimestamp : Id -> Time.Posix -> Model -> ( Model, Cmd Msg )
handleItemCompletedTimestamp id completedAt model =
    let
        setCompletedAt item =
            { item | completedAt = Just completedAt }

        items =
            Dict.update id (Maybe.map setCompletedAt) model.items
    in
    { model | items = items }
        |> withCmdNone


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ListNameChange name ->
            handleListNameChange name model

        CreateItemClick ->
            handleCreateItemClick model

        CreateItemTimestamp timestamp ->
            handleCreateItemTimestamp timestamp model

        ItemDescriptionChange id description ->
            handleItemDescriptionChange id description model

        ItemCompletedChange id checked ->
            handleItemCompletedChange id checked model

        ItemCompletedTimestamp id timestamp ->
            handleItemCompletedTimestamp id timestamp model


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


nameView : String -> Html Msg
nameView name =
    input
        [ type_ "text"
        , placeholder "My Grocery List"
        , value name
        , onInput ListNameChange
        ]
        []


itemCompletedView : Id -> Maybe Time.Posix -> Html Msg
itemCompletedView id completedAt =
    input
        [ type_ "checkbox"
        , checked (isJust completedAt)
        , onCheck (ItemCompletedChange id)
        ]
        []


itemDescriptionView : Id -> String -> Html Msg
itemDescriptionView id description =
    input
        [ type_ "text"
        , onInput (ItemDescriptionChange id)
        , value description
        , placeholder "milk or eggs or chocolate"
        ]
        []


itemView : Item -> Html Msg
itemView item =
    li
        []
        [ itemCompletedView item.id item.completedAt
        , itemDescriptionView item.id item.description
        ]


itemsView : Dict Id Item -> Html Msg
itemsView =
    ul [] << map itemView << values


createItemView : Html Msg
createItemView =
    button [ onClick CreateItemClick ] [ text "Add Item" ]


view : Model -> Html Msg
view model =
    div []
        [ nameView model.name
        , itemsView model.items
        , createItemView
        ]


main : Program () Model Msg
main =
    element
        { init = \() -> ( initial, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
