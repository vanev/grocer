port module Main exposing (main)

import Browser exposing (element)
import Dict exposing (Dict, insert, size)
import Html exposing (Attribute, Html, button, div, input, label, li, text, ul)
import Html.Attributes exposing (attribute, checked, class, classList, placeholder, type_, value)
import Html.Events exposing (onCheck, onClick, onInput)
import Json.Decode as D
import Json.Encode as E
import List exposing (length, map, member)
import List.Extra exposing (elemIndex, remove, splitAt, unique)
import Maybe.Extra exposing (isJust)
import String exposing (fromInt)
import Task
import Time


onDragStart : m -> Attribute m
onDragStart =
    Html.Events.on "dragstart" << D.succeed


onDragEnd : m -> Attribute m
onDragEnd =
    Html.Events.on "dragend" << D.succeed


onDragOver : m -> Attribute m
onDragOver msg =
    Html.Events.preventDefaultOn "dragover" <|
        D.succeed ( msg, True )


onDrop : m -> Attribute m
onDrop msg =
    Html.Events.preventDefaultOn "drop" <|
        D.succeed ( msg, True )


type alias Id =
    String


type alias Item =
    { id : Id
    , description : String
    , createdAt : Time.Posix
    , completedAt : Maybe Time.Posix
    , deletedAt : Maybe Time.Posix
    }


type alias Model =
    { name : String
    , items : Dict Id Item
    , ordering : List Id
    , itemBeingDragged : Maybe Id
    }


encodeMaybe : (v -> E.Value) -> Maybe v -> E.Value
encodeMaybe encodeValue maybeValue =
    case maybeValue of
        Just value ->
            encodeValue value

        Nothing ->
            E.null


encodePosix : Time.Posix -> E.Value
encodePosix =
    E.int << Time.posixToMillis


encodeItem : Item -> E.Value
encodeItem item =
    E.object
        [ ( "id", E.string item.id )
        , ( "description", E.string item.description )
        , ( "createdAt", encodePosix item.createdAt )
        , ( "completedAt", encodeMaybe encodePosix item.completedAt )
        , ( "deletedAt", encodeMaybe encodePosix item.deletedAt )
        ]


encode : Model -> E.Value
encode model =
    E.object
        [ ( "name", E.string model.name )
        , ( "items", E.dict identity encodeItem model.items )
        , ( "ordering", E.list E.string model.ordering )
        , ( "itemBeingDragged", E.null )
        ]


decodePosix : D.Decoder Time.Posix
decodePosix =
    D.map Time.millisToPosix D.int


decodeItem : D.Decoder Item
decodeItem =
    D.map5 Item
        (D.field "id" D.string)
        (D.field "description" D.string)
        (D.field "createdAt" decodePosix)
        (D.field "completedAt" (D.maybe decodePosix))
        (D.field "deletedAt" (D.maybe decodePosix))


decode : D.Decoder Model
decode =
    D.map4 Model
        (D.field "name" D.string)
        (D.field "items" (D.dict decodeItem))
        (D.field "ordering" (D.list D.string))
        (D.field "itemBeingDragged" (D.maybe D.string))


init : E.Value -> ( Model, Cmd Msg )
init flags =
    ( case D.decodeValue decode flags of
        Ok model ->
            model

        Err _ ->
            { name = ""
            , items = Dict.empty
            , ordering = []
            , itemBeingDragged = Nothing
            }
    , Cmd.none
    )


type Msg
    = ListNameChange String
    | CreateItemClick
    | CreateItemTimestamp Time.Posix
    | ItemDescriptionChange Id String
    | ItemCompletedChange Id Bool
    | ItemCompletedTimestamp Id Time.Posix
    | ItemDeleteClick Id
    | ItemDeleteTimestamp Id Time.Posix
    | ItemDragStart Id
    | ItemDragEnd Id
    | ItemDragOver Id
    | ItemDrop Id


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
            { id = id
            , description = ""
            , createdAt = timestamp
            , completedAt = Nothing
            , deletedAt = Nothing
            }

        items =
            insert id newItem model.items

        ordering =
            model.ordering ++ [ id ]
    in
    { model
        | items = items
        , ordering = ordering
    }
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


handleItemDeleteClick : Id -> Model -> ( Model, Cmd Msg )
handleItemDeleteClick id model =
    let
        isDeleted =
            Dict.get id model.items |> Maybe.andThen .deletedAt |> isJust
    in
    if isDeleted then
        let
            setDeletedAt item =
                { item | deletedAt = Nothing }

            items =
                Dict.update id (Maybe.map setDeletedAt) model.items
        in
        { model
            | items = items
            , ordering = model.ordering ++ [ id ]
        }
            |> withCmdNone

    else
        ( model, Task.perform (ItemDeleteTimestamp id) Time.now )


handleItemDeleteTimestamp : Id -> Time.Posix -> Model -> ( Model, Cmd Msg )
handleItemDeleteTimestamp id deletedAt model =
    let
        setDeletedAt item =
            { item | deletedAt = Just deletedAt }

        items =
            Dict.update id (Maybe.map setDeletedAt) model.items
    in
    { model
        | items = items
        , ordering = remove id model.ordering
    }
        |> withCmdNone


handleItemDragStart : Id -> Model -> ( Model, Cmd Msg )
handleItemDragStart id model =
    { model
        | itemBeingDragged = Just id
        , ordering = remove id model.ordering
    }
        |> withCmdNone


handleItemDragEnd : Id -> Model -> ( Model, Cmd Msg )
handleItemDragEnd _ model =
    case model.itemBeingDragged of
        Nothing ->
            model
                |> withCmdNone

        Just id ->
            let
                ordering =
                    if member id model.ordering then
                        model.ordering

                    else
                        model.ordering ++ [ id ]
            in
            { model
                | itemBeingDragged = Nothing
                , ordering = ordering
            }
                |> withCmdNone


handleItemDragOver : Id -> Model -> ( Model, Cmd Msg )
handleItemDragOver _ model =
    model |> withCmdNone


handleItemDrop : Id -> Model -> ( Model, Cmd Msg )
handleItemDrop id model =
    case model.itemBeingDragged of
        Nothing ->
            model
                |> withCmdNone

        Just idBeingDragged ->
            let
                index =
                    elemIndex id model.ordering
                        |> Maybe.withDefault (length model.ordering)

                ( inits, tail ) =
                    splitAt index model.ordering

                ordering =
                    inits ++ idBeingDragged :: tail
            in
            { model | ordering = unique ordering }
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

        ItemDeleteClick id ->
            handleItemDeleteClick id model

        ItemDeleteTimestamp id timestamp ->
            handleItemDeleteTimestamp id timestamp model

        ItemDragStart id ->
            handleItemDragStart id model

        ItemDragEnd id ->
            handleItemDragEnd id model

        ItemDragOver id ->
            handleItemDragOver id model

        ItemDrop id ->
            handleItemDrop id model


port storeData : E.Value -> Cmd msg


updateWithStorage : Msg -> Model -> ( Model, Cmd Msg )
updateWithStorage msg oldModel =
    let
        ( newModel, cmds ) =
            update msg oldModel
    in
    ( newModel
    , Cmd.batch [ storeData (encode newModel), cmds ]
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


nameView : String -> Html Msg
nameView name =
    input
        [ type_ "text"
        , class "List--Name"
        , placeholder "My Grocery List"
        , value name
        , onInput ListNameChange
        ]
        []


itemCompletedView : Id -> Maybe Time.Posix -> Html Msg
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


itemDeletedView : Id -> Maybe Time.Posix -> Html Msg
itemDeletedView id _ =
    button
        [ class "List--Item--Deleted"
        , onClick (ItemDeleteClick id)
        ]
        [ text "❌" ]


itemView : Item -> Html Msg
itemView item =
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


itemsView : List Id -> Dict Id Item -> Html Msg
itemsView ordering allItems =
    let
        items =
            List.filterMap (\id -> Dict.get id allItems) ordering
    in
    ul [ class "List--Items" ] <| map itemView items


createItemView : Html Msg
createItemView =
    button
        [ class "List--CreateItem"
        , onClick CreateItemClick
        ]
        [ text "Add Item" ]


view : Model -> Html Msg
view model =
    div [ class "List" ]
        [ nameView model.name
        , itemsView model.ordering model.items
        , createItemView
        ]


main : Program E.Value Model Msg
main =
    element
        { init = init
        , view = view
        , update = updateWithStorage
        , subscriptions = subscriptions
        }
