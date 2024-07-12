import React from "react";

function TopicList({topics, onSelectTopic}) {
  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.id} onClick={() => onSelectTopic(topic)}>
          {topic.name}
        </li>
      ))}
    </ul>
  );
}

export default TopicList;
