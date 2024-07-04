import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import styles from "./App.module.css";
import TaskList from "./components/task-list/TaskList";
import TaskItem from "./components/task-item/TaskItem";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface ITaskList {
    [key: string]: string[];
}

const App = () => {
    const [taskList, setTaskList] = useState<ITaskList>({
        Planned: ["Learn React", "Learn dnd-kit", "Learn Typescript"],
        Processed: ["Learn CSS", "Learn rtk query"],
        Done: [],
        Test: [],
    });
    const [activeId, setActiveId] = useState<string | null | UniqueIdentifier>(
        null
    );
    console.log("🚀 ~ App ~ taskList:", taskList);

    const dragStartHandler = (e: DragStartEvent) => {
        setActiveId(e.active.id);
    };

    const dragEndHandler = (e: DragEndEvent) => {
        // Check if item is drag into unknown area
        setActiveId(null);
        const { active, over } = e;
        if (!over || !active.data.current || !over.data.current) {
            return;
        }

        // Check if item position is the same
        if (active.id === over?.id) return;

        // Check if item is moved outside of the column
        if (
            active.data.current.sortable.containerId !==
            over.data.current.sortable.containerId
        )
            return;

        // Sort the items list order based on item target position
        const containerName = active.data.current.sortable.containerId;
        setTaskList((taskList) => {
            const temp = { ...taskList };
            if (!e.over) return temp;
            const oldIdx = temp[containerName].indexOf(active.id.toString());
            const newIdx = temp[containerName].indexOf(over.id.toString());
            temp[containerName] = arrayMove(
                temp[containerName],
                oldIdx,
                newIdx
            );
            return temp;
        });
    };

    const dragOverHandler = (e: DragOverEvent) => {
        // Check if item is drag into unknown area
        const { active, over } = e;
        if (!over) {
            // console.log("🚀 ~ dragOverHandler ~ over:", over);
            return;
        }

        // Get the initial and target sortable list name
        const initialContainer = active.data.current?.sortable?.containerId;
        const targetContainer = over?.data.current?.sortable?.containerId;
        console.log(
            "🚀 ~ dragOverHandler ~ initialContainer:",
            initialContainer
        );
        console.log("🚀 ~ dragOverHandler ~ targetContainer:", targetContainer);

        // if there are none initial sortable list name, then item is not sortable item
        if (!initialContainer) return;

        // Order the item list based on target item position
        setTaskList((taskList) => {
            const temp = { ...taskList };
            if (!targetContainer) {
                // If item is already there then don't re-add it
                if (taskList[over.id].includes(active.id.toString()))
                    return temp;

                // Remove item from it's initial container
                temp[initialContainer] = temp[initialContainer].filter(
                    (task) => task !== active.id.toString()
                );

                // Add item to it's target container which the droppable zone belongs to
                temp[over.id].push(active.id.toString());

                return temp;
            }

            // If the item is drag around in the same container then just reorder the list
            if (initialContainer === targetContainer) {
                const oldIdx = temp[initialContainer].indexOf(
                    active.id.toString()
                );
                const newIdx = temp[initialContainer].indexOf(
                    over.id.toString()
                );
                temp[initialContainer] = arrayMove(
                    temp[initialContainer],
                    oldIdx,
                    newIdx
                );
            } else {
                // If the item is drag into another different container

                // Remove item from it's initial container
                temp[initialContainer] = temp[initialContainer].filter(
                    (task) => task !== active.id.toString()
                );

                // Add item to it's target container
                const newIdx = temp[targetContainer].indexOf(
                    over.id.toString()
                );
                temp[targetContainer].splice(newIdx, 0, active.id.toString());
            }

            return temp;
        });
    };

    return (
        // Attach the dragEnd and dragOver event listeners
        <DndContext
            onDragEnd={dragEndHandler}
            onDragOver={dragOverHandler}
            onDragStart={dragStartHandler}
            modifiers={[restrictToWindowEdges]}
        >
            <main className="flex flex-col items-center gap-8 py-8 px-16">
                <h1>Multi Sortable List</h1>
                {/* <div>
                    <TaskList activeId={activeId}></TaskList>
                </div> */}
                <div className={styles.container}>
                    {/* <div className="grid grid-cols-[repeat(2,1fr)] justify-evenly w-[75%] p-4 border border-black"> */}
                    {Object.keys(taskList).map((key) => (
                        <TaskList
                            activeId={activeId}
                            key={key}
                            title={key}
                            tasks={taskList[key]}
                        />
                    ))}
                </div>
            </main>
            <DragOverlay>
                {activeId ? <TaskItem title={activeId} dragOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default App;
