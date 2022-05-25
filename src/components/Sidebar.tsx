import type { FormElement } from '@nextui-org/react'
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
import { useSetAtom } from 'jotai'
import React, { memo, useState, useCallback, useRef } from 'react'

import { searchQueryAtom } from '../atom'

const Sidebar = () => {
  const input = useRef() as React.RefObject<FormElement>
  const [visible, setVisible] = useState(false)
  const onOpen = useCallback(() => setVisible(true), [])
  const onClose = useCallback(() => {
    setVisible(false)
  }, [])
  const setSearchQuery = useSetAtom(searchQueryAtom)
  const onSubmit = useCallback(() => setSearchQuery(input.current!.value), [])

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
          onClick={onOpen}
        >
          +
        </Button>
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible}
          onClose={onClose}
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
              ref={input}
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
            <Button type="submit" auto onClick={onSubmit}>
              Search
            </Button>
            <Button auto flat color="error" onClick={onClose}>
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
