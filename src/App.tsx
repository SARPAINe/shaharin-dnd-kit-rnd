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

function orderItems(
    containerName: string,
    active: any,
    over: any,
    currentItem: any
) {
    const temp = { ...currentItem };
    if (!over) return temp;
    const oldIdx = temp[containerName].indexOf(active.id.toString());
    const newIdx = temp[containerName].indexOf(over.id.toString());
    temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx);
    console.log(temp);
    return temp;
}

const App = () => {
    const initialTaskList: ITaskList = {
        Origin: [
            "Learn React",
            "Learn dnd-kit",
            "Learn Typescript",
            "Learn CSS",
            "Learn rtk query",
        ],
    };
    const [origin, setOrigin] = useState(initialTaskList);
    const [taskList, setTaskList] = useState<ITaskList>({
        Planned: [],
        Processed: [],
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
        setActiveId(null);
        const { active, over } = e;
        if (!over || !active.data.current || !over.data.current) {
            return;
        }

        console.log(active, over);

        if (active.id === over?.id) return;

        if (
            active.data.current.sortable.containerId !==
            over.data.current.sortable.containerId
        )
            return;
        const containerName = over.data.current.sortable.containerId;

        setTaskList((taskList) =>
            orderItems(containerName, active, over, taskList)
        );
    };

    const dragOverHandler = (e: DragOverEvent) => {
        const { active, over } = e;
        if (!over) {
            return;
        }

        const initialContainer = active.data.current?.sortable?.containerId;
        const targetContainer =
            over?.data.current?.sortable?.containerId || over.id;
        console.log(initialContainer, targetContainer);

        if (!initialContainer) return;

        if (initialContainer == "Origin") {
            setOrigin((origin) => {
                const temp = { ...origin };
                if (initialContainer === targetContainer) {
                    return orderItems(initialContainer, active, over, temp);
                } else {
                    temp["Origin"] = temp["Origin"].filter(
                        (item) => item != active.id
                    );
                    setTaskList((tasks) => {
                        const tempTasks = { ...tasks };
                        const targetIndex = tempTasks[targetContainer].indexOf(
                            over.id.toString()
                        );
                        tempTasks[targetContainer].splice(
                            targetIndex,
                            0,
                            active.id.toString()
                        );
                        return tempTasks;
                    });
                }
                return temp;
            });
        } else if (
            targetContainer == "Origin" &&
            initialContainer !== targetContainer
        ) {
            //children to origin
            console.log("🚀 ~ dragOverHandler ~ active:", active);
            console.log("🚀 ~ dragOverHandler ~ over:", over);
            setTaskList((taskList) => {
                const temp = { ...taskList };
                temp[initialContainer] = temp[initialContainer].filter(
                    (item) => item != active.id
                );
                setOrigin((origin) => {
                    const tempTasks = { ...origin };
                    const targetIndex = tempTasks[targetContainer].indexOf(
                        over.id.toString()
                    );
                    tempTasks[targetContainer].splice(
                        targetIndex,
                        0,
                        active.id.toString()
                    );

                    console.log("🚀 ~ setOrigin ~ tempTasks:", tempTasks);
                    return tempTasks;
                });
                return temp;
            });
        } else {
            setTaskList((taskList) => {
                const temp = { ...taskList };
                if (!targetContainer) {
                    if (taskList[over.id].includes(active.id.toString()))
                        return temp;

                    temp[initialContainer] = temp[initialContainer].filter(
                        (task) => task !== active.id.toString()
                    );
                    temp[over.id].push(active.id.toString());

                    return temp;
                }

                if (initialContainer === targetContainer) {
                    return orderItems(initialContainer, active, over, temp);
                } else {
                    temp[initialContainer] = temp[initialContainer].filter(
                        (task) => task !== active.id.toString()
                    );

                    const newIdx = temp[targetContainer].indexOf(
                        over.id.toString()
                    );
                    temp[targetContainer].splice(
                        newIdx,
                        0,
                        active.id.toString()
                    );
                }

                return temp;
            });
        }
    };

    return (
        <DndContext
            onDragEnd={dragEndHandler}
            onDragOver={dragOverHandler}
            onDragStart={dragStartHandler}
            modifiers={[restrictToWindowEdges]}
        >
            <main className="flex flex-col items-center gap-8 py-8 px-16">
                <h1>Multi Sortable List</h1>
                <div className={styles.origin}>
                    <TaskList
                        activeId={activeId}
                        key={"Origin"}
                        title={"Origin"}
                        tasks={origin["Origin"]}
                    />
                </div>
                <div className={styles.container}>
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
