import React from 'react';
import { Button, Collapse } from 'react-bootstrap';

const collapseData = [
  { id: 1, title: 'Item 1', content: 'Content for Item 1' },
  { id: 2, title: 'Item 2', content: 'Content for Item 2' },
  { id: 3, title: 'Item 3', content: 'Content for Item 3' },
];

function Trips() {
  const [openCollapseId, setOpenCollapseId] = React.useState(null);

  const toggleCollapse = (id) => {
    setOpenCollapseId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div>
      {collapseData.map((item) => (
        <div key={item.id}>
          <Button
            onClick={() => toggleCollapse(item.id)}
            aria-controls={`collapse-${item.id}`}
            aria-expanded={openCollapseId === item.id}
          >
            {item.title}
          </Button>
          <Collapse in={openCollapseId === item.id}>
            <div id={`collapse-${item.id}`}>
              <p>{item.content}</p>
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
}

    {/* {days.map((item, i) => {
                return (
                  <div className={`col-12 p-0 ${styles.dayshero}`} key={i}>
                    <p className={styles.days}>{item.day}</p>
                  </div>
                );
              })} */}
export default Trips;
