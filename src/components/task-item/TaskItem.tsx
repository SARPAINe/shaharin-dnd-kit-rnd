import { useSortable } from "@dnd-kit/sortable";
import { FC } from "react";
import styles from "./TaskItem.module.css";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

interface ITaskItem {
    title: string | UniqueIdentifier;
    dragOverlay?: boolean;
}

const TaskItem: FC<ITaskItem> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
        transition,
    } = useSortable({
        id: props.title,
    });
    return (
        <li
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
                opacity: isDragging ? 0 : 1,
                width: "100%",
                // position: props.dragOverlay ? "absolute" : "relative",
            }}
            className={styles["list-item"]}
        >
            {props.title}
        </li>
    );
};

export default TaskItem;
