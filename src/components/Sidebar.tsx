import {
  Card,
  Avatar,
  Divider,
  Button,
  Modal,
  Text,
  Input,
  Row,
  Checkbox,
} from '@nextui-org/react'
import React, { memo, useState, useCallback } from 'react'

const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const handler = useCallback(() => setVisible(true), [])

  const closeHandler = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <Card as="section" css={{ borderRadius: 0, h: '100%' }}>
      <Card.Body
        as="aside"
        css={{
          ai: 'center',
          d: 'flex',
          fd: 'colmun',
          jc: 'flex-end',
          p: '20px 10px',
        }}
      >
        <Button
          auto
          size="md"
          color="gradient"
          shadow
          css={{ border: 0, fontSize: '30px', padding: '0 15px' }}
          onClick={handler}
        >
          +
        </Button>
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Search{' '}
              <Text b size={18}>
                GitHub Username
              </Text>
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="ryota-murakami"
            />
            <Row justify="space-between">
              <Checkbox>
                <Text size={14}>Issue/PR/Discussion Comments</Text>
              </Checkbox>
              <Checkbox>
                <Text size={14}>Opened Issue/PR/Discussion</Text>
              </Checkbox>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto onClick={closeHandler}>
              Search
            </Button>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
      <Divider />
      <Card.Footer blur as="footer" css={{ p: '20px 10px' }}>
        <Avatar src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4" />
      </Card.Footer>
    </Card>
  )
}

export default memo(Sidebar)
