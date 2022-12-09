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
import { useAtom } from 'jotai'
import React, { memo, useState, useCallback, useRef } from 'react'

import { subscribedAtom } from '../atom'

const Sidebar = () => {
  const userNameInput = useRef() as React.RefObject<FormElement>

  const [issueCommentCheck, setIssueCommentCheck] = useState(false)
  const [discussionCommentCheck, setDiscussionCommentCheck] = useState(false)
  const [visible, setVisible] = useState(false)

  const onOpen = useCallback(() => setVisible(true), [])
  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  const [subscribed, setSubscribed] = useAtom(subscribedAtom)

  //  @TODO const setValidSearchQueryAtom = useSetAtom(validSearchQueryAtom)
  const onSubmit = useCallback(() => {
    setSubscribed([
      ...subscribed,
      {
        discussionComments: discussionCommentCheck,
        issueComments: issueCommentCheck,
        username: userNameInput.current!.value,
      },
    ])
    setVisible(false)
  }, [issueCommentCheck, discussionCommentCheck, subscribed])

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
              aria-label="userNameInput"
              ref={userNameInput}
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="ryota-murakami"
            />
            <Row justify="space-between">
              <Checkbox onChange={setIssueCommentCheck} label="Issue Comments">
                <Text size={14}>Issue Comments</Text>
              </Checkbox>
              <Checkbox
                onChange={setDiscussionCommentCheck}
                label="Disscussion Comments"
              >
                <Text size={14}>Disscussion Comments</Text>
              </Checkbox>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" auto onPress={onSubmit}>
              Search
            </Button>
            <Button auto flat color="error" onPress={onClose}>
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
