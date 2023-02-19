import { DragOverlay, UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FC } from "react";
import TaskItem from "../task-item/TaskItem";
import styles from "./TaskList.module.css";

interface ITaskList {
    title: string;
    tasks: string[];
    activeId?: UniqueIdentifier | null;
}

const TaskList: FC<ITaskList> = (props) => {
    const { setNodeRef } = useDroppable({ id: props.title });

    return (
        // <article className="flex flex-col items-center p-4 border border-black min-h-[100%] w-[30%] gap-4">
        <article className={styles.column}>
            <h1 className="text-lg">{props.title}</h1>
            <div className={styles.divider} />
            {/* <div className={"border border-black w-full"} /> */}
            <SortableContext id={props.title} items={props.tasks}>
                {/* <ul
          ref={setNodeRef}
          className="flex flex-col gap-4 w-full h-full bg-[beige]"
        > */}
                <ul ref={setNodeRef} className={styles.list}>
                    {props.tasks.map((task) => (
                        <TaskItem key={task} title={task} />
                    ))}
                </ul>
            </SortableContext>
        </article>
    );
};

export default TaskList;
