module Update exposing (update)

import Item
import List.Extra exposing (remove)
import Maybe exposing (Maybe(..))
import Model exposing (Model, addItem, updateItem)
import Msg exposing (Msg(..))
import Ordering exposing (insertBefore, snoc)
import Task exposing (perform)
import Time exposing (now)


withCmdNone : Model -> ( Model, Cmd Msg )
withCmdNone model =
    ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ListNameChange name ->
            { model | name = name }
                |> withCmdNone

        CreateItemClick ->
            ( model, perform CreateItemTimestamp now )

        CreateItemTimestamp timestamp ->
            addItem timestamp model
                |> withCmdNone

        ItemDescriptionChange id description ->
            updateItem (Item.setDescription description) id model
                |> withCmdNone

        ItemCompletedChange id checked ->
            if checked then
                ( model, Task.perform (ItemCompletedTimestamp id) Time.now )

            else
                updateItem Item.unsetCompletedAt id model
                    |> withCmdNone

        ItemCompletedTimestamp id timestamp ->
            updateItem (Item.setCompletedAt (Just timestamp)) id model
                |> withCmdNone

        ItemDeleteClick id ->
            if Model.itemIsDeleted id model |> Maybe.withDefault True then
                updateItem Item.unsetDeletedAt id model
                    |> (\m -> { m | ordering = snoc id m.ordering })
                    |> withCmdNone

            else
                ( model, Task.perform (ItemDeleteTimestamp id) Time.now )

        ItemDeleteTimestamp id timestamp ->
            updateItem (Item.setDeletedAt (Just timestamp)) id model
                |> (\m -> { m | ordering = remove id m.ordering })
                |> withCmdNone

        ItemDragStart id ->
            { model
                | itemBeingDragged = Just id
                , ordering = remove id model.ordering
            }
                |> withCmdNone

        ItemDragEnd _ ->
            case model.itemBeingDragged of
                Nothing ->
                    model |> withCmdNone

                Just idBeingDragged ->
                    { model
                        | itemBeingDragged = Nothing
                        , ordering = Ordering.add idBeingDragged model.ordering
                    }
                        |> withCmdNone

        ItemDragOver _ ->
            model |> withCmdNone

        ItemDrop id ->
            case model.itemBeingDragged of
                Nothing ->
                    model |> withCmdNone

                Just idBeingDragged ->
                    { model | ordering = insertBefore id idBeingDragged model.ordering }
                        |> withCmdNone
