import { Box, Container, Text, Title, Paper, Divider, Badge } from '@mantine/core';
import { usePage } from '@inertiajs/react';
import { Announcement } from '../Dashboard/SuperAdminDashboard/Announcement/Announcement.types';
import './AnnouncementDescriptionComponent.css'; // Import the CSS file

function AnnouncementDescriptionComponent() {
  // Access the announcementInfo passed from the controller
  const { announcementInfo } = usePage<{ announcementInfo: Announcement }>().props;


  const truncateHTML = (html: string, maxLength: number) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    let text = '';
    let length = 0; 
  
    const traverseNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const remainingLength = maxLength - length;
  
        if (remainingLength <= 0) return; // Stop if maxLength is reached
  
        if (textContent.length > remainingLength) {
          text += textContent.substring(0, remainingLength) + '...';
          length = maxLength; // Set length to maxLength to stop traversal
        } else {
          text += textContent;
          length += textContent.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (length < maxLength) {
          const newElement = document.createElement(element.tagName);
          Array.from(element.childNodes).forEach(traverseNodes);
          if (newElement.childNodes.length > 0) {
            div.appendChild(newElement);
          }
        }
      }
    };
  
    Array.from(div.childNodes).forEach(traverseNodes);
  
    return text.length > maxLength ? text : div.innerHTML; // Return HTML if not truncated
  };

  return (
    <Box className='w-full'>
    {announcementInfo ? (
      <>
        <Title order={3}>
          {announcementInfo.title}
        </Title>
        <Divider my="sm" />
        <div>
          <div 
            style={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: '1.6',
            }} 
            className="announcement-content"
            dangerouslySetInnerHTML={{ __html: announcementInfo.description }} 
          />
        </div>
        <Divider my="sm" />
        {/* Date and status with blinking published date */}
        <Box  display="flex-end">
          <Badge size="lg" style={{textAlign:'right'}} color="red" variant="filled" radius="md" className="blink">
            Published on: {new Date(announcementInfo.created_at).toLocaleDateString()}
          </Badge>
        </Box>
      </>
    ) : (
      <Text color="red">No announcement found.</Text>
    )}
  </Box>
  );
}

export default AnnouncementDescriptionComponent;
